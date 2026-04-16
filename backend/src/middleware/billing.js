import db from '../db.js';

/**
 * 用量计费 + 额度扣减
 *
 * @param {Object} params
 * @param {number} params.userId
 * @param {number} params.apiKeyId       - 主 Key ID
 * @param {number|null} params.subKeyId  - 子密钥 ID（可选，null=主Key）
 * @param {string} params.model
 * @param {Object|null} params.usage
 * @param {number} params.latencyMs
 * @param {Object} params.requestBody
 * @param {number} params.responseStatus
 */
export function recordUsage({ userId, apiKeyId, subKeyId, model, usage, latencyMs, requestBody, responseStatus }) {
  const modelConfig = db.prepare('SELECT * FROM models WHERE model_id = ? AND enabled = 1').get(model);

  let cost = 0;
  if (modelConfig && usage) {
    const promptTokens = usage.prompt_tokens || 0;
    const completionTokens = usage.completion_tokens || 0;
    const totalTokens = usage.total_tokens || (promptTokens + completionTokens);

    cost = (promptTokens * modelConfig.input_price + completionTokens * modelConfig.output_price) / 1_000_000;
    cost = Math.round(cost * 10000) / 10000;
  }

  // 插入用量日志
  const insertLog = db.prepare(`
    INSERT INTO usage_logs (user_id, api_key_id, sub_key_id, model, prompt_tokens, completion_tokens, total_tokens, cost, latency_ms, request_body, response_status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const logResult = insertLog.run(
    userId,
    apiKeyId,
    subKeyId || null,
    model,
    usage?.prompt_tokens || 0,
    usage?.completion_tokens || 0,
    usage?.total_tokens || 0,
    cost,
    latencyMs || 0,
    requestBody ? JSON.stringify(requestBody) : null,
    responseStatus || 200
  );

  // ---- 扣减逻辑 ----
  if (cost > 0) {
    // Sub-key 额度扣减（优先）
    if (subKeyId) {
      deductSubKeyQuota(subKeyId, cost);
    } else {
      deductUserBalance(userId, cost, model);
    }
  }

  return { logId: logResult.lastInsertRowid, cost };
}

function deductSubKeyQuota(subKeyId, cost) {
  const deduct = db.transaction(() => {
    const sk = db.prepare('SELECT * FROM sub_keys WHERE id = ?').get(subKeyId);
    if (!sk) return;

    const newUsed = Math.round((sk.quota_used + cost) * 10000) / 10000;
    db.prepare('UPDATE sub_keys SET quota_used = ? WHERE id = ?').run(newUsed, subKeyId);
  });
  deduct();
}

function deductUserBalance(userId, cost, model) {
  const updateBalance = db.transaction(() => {
    const user = db.prepare('SELECT balance FROM users WHERE id = ?').get(userId);
    const newBalance = Math.round((user.balance - cost) * 10000) / 10000;

    db.prepare('UPDATE users SET balance = ?, updated_at = datetime("now") WHERE id = ?')
      .run(newBalance, userId);

    db.prepare(`
      INSERT INTO balance_logs (user_id, type, amount, balance_before, balance_after, remark)
      VALUES (?, 'deduct', ?, ?, ?, ?)
    `).run(userId, -cost, user.balance, newBalance, `API调用: ${model}`);
  });

  updateBalance();
}

/**
 * 封顶费用：单次请求最大消费限制（单位：元）
 */
export const MAX_COST_PER_REQUEST = 10;
