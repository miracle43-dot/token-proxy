import { Router } from 'express';
import axios from 'axios';
import { authenticateApiKey } from '../middleware/apikey.js';
import { recordUsage } from '../middleware/billing.js';
import db from '../db.js';
import config from '../config.js';

const router = Router();

router.use(authenticateApiKey);

function getUpstream(req) {
  const model = req.body?.model || req.query?.model || '';
  if (model.startsWith('claude-')) return config.upstream.anthropic;
  if (model.startsWith('gemini-')) return config.upstream.google;
  return config.upstream.openai;
}

// POST /v1/chat/completions
router.post('/chat/completions', async (req, res) => {
  const startTime = Date.now();
  const baseURL = getUpstream(req);
  const model = req.body?.model;
  const userId = req.user.id;
  const apiKeyId = req.apiKey.id;
  const requestBody = req.body;

  // 验证模型是否启用
  const modelConfig = db.prepare('SELECT * FROM models WHERE model_id = ? AND enabled = 1').get(model);
  if (!modelConfig) {
    return res.status(400).json({
      error: { message: `Model '${model}' is not available`, type: 'invalid_request_error' },
    });
  }

  // 构建转发的 headers
  const headers = { ...req.headers };
  delete headers['authorization'];
  delete headers['content-length'];
  headers['Content-Type'] = 'application/json';

  try {
    let path = '/v1/chat/completions';
    if (model.startsWith('gemini-')) {
      // Gemini 使用不同的 API 端点，需要 API key 作为 query param
      // 这里简化处理，引导用户使用 OpenAI 兼容接口
      return res.status(400).json({
        error: { message: 'Gemini model not supported via this endpoint in MVP', type: 'invalid_request_error' },
      });
    }

    const upstreamRes = await axios({
      method: 'POST',
      url: `${baseURL}${path}`,
      data: requestBody,
      headers,
      timeout: 120000,
      responseType: requestBody.stream ? 'stream' : 'json',
      validateStatus: () => true,
    });

    const latencyMs = Date.now() - startTime;
    const responseStatus = upstreamRes.status;
    const usage = !requestBody.stream ? upstreamRes.data?.usage : null;

    // 流式响应
    if (requestBody.stream) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      upstreamRes.data.pipe(res);

      // 流结束后记录（不精确但可接受）
      upstreamRes.data.on('end', () => {
        recordUsage({ userId, apiKeyId, model, usage: null, latencyMs, requestBody, responseStatus });
      });
    } else {
      if (upstreamRes.status >= 400) {
        return res.status(upstreamRes.status).json(upstreamRes.data || { error: { message: 'Upstream error' } });
      }

      if (usage) {
        recordUsage({ userId, apiKeyId, model, usage, latencyMs, requestBody, responseStatus });
      }

      return res.status(upstreamRes.status).json(upstreamRes.data);
    }

  } catch (err) {
    const latencyMs = Date.now() - startTime;
    console.error('Proxy error:', err.message);

    recordUsage({
      userId, apiKeyId, model,
      usage: null, latencyMs,
      requestBody,
      responseStatus: err.response?.status || 500,
    });

    if (err.response) {
      return res.status(err.response.status).json(err.response.data || { error: { message: 'Upstream error' } });
    }

    res.status(502).json({ error: { message: 'Failed to reach upstream API', type: 'upstream_error' } });
  }
});

// GET /v1/models
router.get('/models', async (req, res) => {
  const baseURL = getUpstream(req);

  try {
    const upstreamRes = await axios({
      method: 'GET',
      url: `${baseURL}/v1/models`,
      headers: { 'Authorization': req.headers.authorization },
      timeout: 30000,
    });

    const ourModelIds = new Set(
      db.prepare('SELECT model_id FROM models WHERE enabled = 1').all().map(m => m.model_id)
    );

    const filtered = (upstreamRes.data.data || []).filter(m => ourModelIds.has(m.id));

    return res.json({ object: 'list', data: filtered });
  } catch {
    // 上游失败时返回本地模型列表
    const models = db.prepare('SELECT model_id as id, name, provider FROM models WHERE enabled = 1').all();
    res.json({ object: 'list', data: models });
  }
});

// GET /v1/models/:model
router.get('/models/:model', (req, res) => {
  const model = db.prepare('SELECT * FROM models WHERE model_id = ? AND enabled = 1').get(req.params.model);
  if (!model) {
    return res.status(404).json({ error: { message: 'Model not found' } });
  }
  res.json({
    id: model.model_id,
    object: 'model',
    created: 1700000000,
    name: model.name,
    owned_by: model.provider,
  });
});

export default router;
