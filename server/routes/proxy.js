import express from 'express';
import axios from 'axios';
import { queryOne, execute, saveDb } from '../db/index.js';
import { apiKeyAuth } from '../middleware/auth.js';
import { calculateCost } from '../utils/pricing.js';

const router = express.Router();

const UPSTREAM_BASE_URL = process.env.UPSTREAM_BASE_URL || 'https://api.openai.com';
const DEFAULT_MODEL = process.env.DEFAULT_MODEL || 'gpt-4o-mini';

function estimateTokens(text) {
  const chineseChars = (text.match(/[\u4e00-\u9fff]/g) || []).length;
  const otherChars = text.length - chineseChars;
  return Math.ceil(chineseChars / 2 + otherChars / 4);
}

router.post('/chat/completions', apiKeyAuth, async (req, res) => {
  const startTime = Date.now();
  const { apiKey, user } = req;

  try {
    const { model, messages, ...otherParams } = req.body;
    const targetModel = model || DEFAULT_MODEL;

    const promptText = messages.map(m => m.content || '').join('');
    const estimatedPromptTokens = estimateTokens(promptText);
    const estimatedCompletionTokens = otherParams.max_tokens ? otherParams.max_tokens : 1000;
    const estimatedCost = calculateCost(targetModel, estimatedPromptTokens, estimatedCompletionTokens);

    const totalBalance = (user.balance || 0) + (apiKey.balance || 0);
    if (totalBalance < estimatedCost) {
      return res.status(402).json({
        error: {
          message: `余额不足。预估费用: ¥${estimatedCost.toFixed(4)}，当前余额: ¥${totalBalance.toFixed(4)}`,
          type: 'insufficient_balance',
          code: 402
        }
      });
    }

    const upstreamResponse = await axios.post(
      `${UPSTREAM_BASE_URL}/v1/chat/completions`,
      { model: targetModel, messages, ...otherParams },
      {
        headers: {
          'Authorization': `Bearer ${process.env.UPSTREAM_API_KEY || req.headers['x-upstream-key'] || ''}`,
          'Content-Type': 'application/json'
        },
        timeout: 120000
      }
    );

    const responseTime = Date.now() - startTime;
    const responseData = upstreamResponse.data;

    let inputTokens = estimatedPromptTokens;
    let outputTokens = 0;
    let cost = 0;

    if (responseData.usage) {
      inputTokens = responseData.usage.prompt_tokens || estimatedPromptTokens;
      outputTokens = responseData.usage.completion_tokens || 0;
      cost = calculateCost(targetModel, inputTokens, outputTokens);
    } else if (responseData.choices) {
      const completionText = responseData.choices.map(c => c.message?.content || '').join('');
      outputTokens = estimateTokens(completionText);
      cost = calculateCost(targetModel, inputTokens, outputTokens);
    }

    if (cost > 0) {
      const keyBalance = apiKey.balance || 0;
      const keyCost = Math.min(cost, keyBalance);
      const userCost = cost - keyCost;

      if (keyCost > 0) {
        execute('UPDATE api_keys SET balance = balance - ? WHERE id = ?', [keyCost, apiKey.id]);
      }
      if (userCost > 0) {
        execute('UPDATE users SET balance = balance - ? WHERE id = ?', [userCost, user.id]);
      }

      const userBefore = queryOne('SELECT balance FROM users WHERE id = ?', [user.id]);
      execute(`
        INSERT INTO transactions (user_id, type, amount, balance_before, balance_after, description)
        VALUES (?, 'api_usage', ?, ?, ?, ?)
      `, [user.id, -cost, userBefore?.balance || 0, (userBefore?.balance || 0) - cost, `API调用: ${targetModel}`]);

      saveDb();
    }

    execute(`
      INSERT INTO usage_logs (api_key_id, user_id, model, input_tokens, output_tokens, cost, endpoint, request_time, response_time, status_code)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [apiKey.id, user.id, targetModel, inputTokens, outputTokens, cost, '/v1/chat/completions', estimatedPromptTokens, responseTime, 200]);

    saveDb();
    res.set('X-Request-Id', `req_${Date.now()}`);
    res.json(responseData);

  } catch (err) {
    const responseTime = Date.now() - startTime;
    const statusCode = err.response?.status || 500;

    execute(`
      INSERT INTO usage_logs (api_key_id, user_id, model, input_tokens, output_tokens, cost, endpoint, request_time, response_time, status_code)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [apiKey.id, user.id, req.body.model || DEFAULT_MODEL, 0, 0, 0, '/v1/chat/completions', 0, responseTime, statusCode]);
    saveDb();

    console.error('Proxy error:', err.message);

    if (err.response) {
      return res.status(statusCode).json(err.response.data);
    }
    res.status(500).json({
      error: { message: err.message || '代理请求失败', type: 'proxy_error' }
    });
  }
});

router.get('/models', apiKeyAuth, async (req, res) => {
  try {
    const upstreamResponse = await axios.get(`${UPSTREAM_BASE_URL}/v1/models`, {
      headers: {
        'Authorization': `Bearer ${process.env.UPSTREAM_API_KEY || ''}`
      },
      timeout: 10000
    });
    res.json(upstreamResponse.data);
  } catch (err) {
    console.error('Models fetch error:', err.message);
    res.status(500).json({ error: { message: '获取模型列表失败' } });
  }
});

export default router;
