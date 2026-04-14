import db from '../db.js';

/**
 * 用量计费中间件
 * 在代理请求完成后调用 recordUsage(req, usage, latencyMs)
 * 自动计算费用并扣除余额
 */
export function recordUsage({ userId, apiKeyId, model, usage, latencyMs, requestBody, responseStatus }) {
  const modelConfig = db.prepare('SELECT * FROM models WHERE model_id = ? AND enabled = 1').get(model);

  let cost = 0;
  if (modelConfig && usage) {
    const promptTokens = usage.prompt_tokens || 0;
    const completionTokens = usage.completion_tokens || 0;
    const totalTokens = usage.total_tokens || (promptTokens + completionTokens);

    cost = (promptTokens * modelConfig.input_price + completionTokens * modelConfig.output_price) / 1_000_000;
    cost = Math.round(cost * 10000) / 10000; // 保留4位小数
  }

  // 插入用量日志
  const insertLog = db.prepare(`
    INSERT INTO usage_logs (user_id, api_key_id, model, prompt_tokens, completion_tokens, total_tokens, cost, latency_ms, request_body, response_status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const logResult = insertLog.run(
    userId,
    apiKeyId,
    model,
    usage?.prompt_tokens || 0,
    usage?.completion_tokens || 0,
    usage?.total_tokens || 0,
    cost,
    latencyMs || 0,
    requestBody ? JSON.stringify(requestBody) : null,
    responseStatus || 200
  );

  // 扣除余额
  if (cost > 0) {
    const updateBalance = db.transaction(() => {
      const user = db.prepare('SELECT balance FROM users WHERE id = ?').get(userId);
      const newBalance = Math.round((user.balance - cost) * 10000) / 10000;

      db.prepare('UPDATE users SET balance = ?, updated_at = datetime("now") WHERE id = ?')
        .run(newBalance, userId);

      db.prepare(`
        INSERT INTO balance_logs (user_id, type, amount, balance_before, balance_after, remark)
        VALUES (?, 'deduct', ?, ?, ?, ?)
      `).run(userId, -cost, user.balance, newBalance, `API调用: ${model}`);

      return newBalance;
    });

    updateBalance();
  }

  return { logId: logResult.lastInsertRowid, cost };
}

/**
 * 封顶费用：单次请求最大消费限制（单位：元）
 */
export const MAX_COST_PER_REQUEST = 10;
