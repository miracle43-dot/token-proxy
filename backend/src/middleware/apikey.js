import db from '../db.js';

/**
 * API Key 认证中间件（支持主 Key 和 Sub-key）
 *
 * 主 Key: sk-proxy-xxx  → 查询 api_keys 表
 * Sub-key: sk-sub-xxx   → 查询 sub_keys 表
 *
 * 认证成功后挂载:
 *   req.apiKey    → { id, name, isSubKey, subKeyId }
 *   req.user      → { id, email, balance }
 */
export function authenticateApiKey(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }

  const key = auth.slice(7);
  if (!key.startsWith('sk-proxy-') && !key.startsWith('sk-sub-')) {
    return res.status(401).json({ error: 'Invalid API key format' });
  }

  // ---- Sub-key 验证 ----
  if (key.startsWith('sk-sub-')) {
    return authenticateSubKey(req, res, next, key);
  }

  // ---- 主 Key 验证 ----
  const record = db.prepare(`
    SELECT ak.id as key_id, ak.user_id, ak.status, ak.name,
           u.email, u.balance, u.is_admin
    FROM api_keys ak
    JOIN users u ON u.id = ak.user_id
    WHERE ak.key = ?
  `).get(key);

  if (!record) {
    return res.status(401).json({ error: 'Invalid API key' });
  }

  if (record.status !== 'active') {
    return res.status(403).json({ error: 'API key is disabled' });
  }

  if (record.balance <= 0) {
    return res.status(402).json({ error: 'Insufficient balance. Please recharge.' });
  }

  req.apiKey = { id: record.key_id, name: record.name, isSubKey: false, subKeyId: null };
  req.user = { id: record.user_id, email: record.email, balance: record.balance };
  next();
}

/**
 * Sub-key 认证流程
 * 1. 查找 sub_key 记录
 * 2. 验证状态 + 额度
 * 3. 验证模型权限
 * 4. 验证父级主 Key 状态
 */
function authenticateSubKey(req, res, next, key) {
  const subKeyRecord = db.prepare(`
    SELECT sk.*,
           ak.user_id as parent_user_id, ak.status as parent_status,
           u.email, u.balance
    FROM sub_keys sk
    JOIN api_keys ak ON ak.id = sk.parent_key_id
    JOIN users u ON u.id = sk.user_id
    WHERE sk.sub_key = ?
  `).get(key);

  if (!subKeyRecord) {
    return res.status(401).json({ error: 'Invalid sub-key' });
  }

  if (subKeyRecord.status !== 'active') {
    return res.status(403).json({ error: 'Sub-key is disabled' });
  }

  if (subKeyRecord.parent_status !== 'active') {
    return res.status(403).json({ error: 'Parent API key is disabled' });
  }

  // 额度检查
  if (subKeyRecord.quota_limit > 0 && subKeyRecord.quota_used >= subKeyRecord.quota_limit) {
    return res.status(402).json({
      error: { message: 'Sub-key quota exceeded. Please contact the key owner.', type: 'quota_exceeded' },
    });
  }

  // 模型权限检查
  if (subKeyRecord.allowed_models && subKeyRecord.allowed_models !== '[]') {
    let allowed;
    try {
      allowed = JSON.parse(subKeyRecord.allowed_models);
    } catch {
      allowed = [];
    }
    if (Array.isArray(allowed) && allowed.length > 0) {
      const requestedModel = req.body?.model || req.query?.model || '';
      if (!allowed.includes(requestedModel)) {
        return res.status(403).json({
          error: {
            message: `Model '${requestedModel}' is not allowed for this sub-key. Allowed: ${allowed.join(', ')}`,
            type: 'model_not_allowed',
          },
        });
      }
    }
  }

  req.apiKey = {
    id: subKeyRecord.parent_key_id,
    name: subKeyRecord.name,
    isSubKey: true,
    subKeyId: subKeyRecord.id,
  };
  req.user = { id: subKeyRecord.user_id, email: subKeyRecord.email, balance: subKeyRecord.balance };
  next();
}

export default { authenticateApiKey };
