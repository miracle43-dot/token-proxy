import express from 'express';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// 模型列表和价格（无需认证）
router.get('/', (req, res) => {
  const models = [
    // OpenAI
    { id: 'gpt-4o', name: 'GPT-4o', provider: 'openai', price_per_1k_input: 0.0025, price_per_1k_output: 0.01, context_window: 128000, capabilities: ['chat', 'vision'] },
    { id: 'gpt-4o-mini', name: 'GPT-4o Mini', provider: 'openai', price_per_1k_input: 0.00015, price_per_1k_output: 0.0006, context_window: 128000, capabilities: ['chat', 'vision'] },
    { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', provider: 'openai', price_per_1k_input: 0.01, price_per_1k_output: 0.03, context_window: 128000, capabilities: ['chat', 'vision'] },
    { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'openai', price_per_1k_input: 0.0005, price_per_1k_output: 0.0015, context_window: 16385, capabilities: ['chat'] },
    // Anthropic
    { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet', provider: 'anthropic', price_per_1k_input: 0.003, price_per_1k_output: 0.015, context_window: 200000, capabilities: ['chat', 'vision'] },
    { id: 'claude-3-5-haiku-20241022', name: 'Claude 3.5 Haiku', provider: 'anthropic', price_per_1k_input: 0.0008, price_per_1k_output: 0.004, context_window: 200000, capabilities: ['chat', 'vision'] },
    { id: 'claude-3-opus', name: 'Claude 3 Opus', provider: 'anthropic', price_per_1k_input: 0.015, price_per_1k_output: 0.075, context_window: 200000, capabilities: ['chat', 'vision'] },
    // Google
    { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', provider: 'google', price_per_1k_input: 0, price_per_1k_output: 0, context_window: 1000000, capabilities: ['chat', 'vision'] },
    { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', provider: 'google', price_per_1k_input: 0.00125, price_per_1k_output: 0.005, context_window: 2000000, capabilities: ['chat', 'vision'] },
    { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', provider: 'google', price_per_1k_input: 0.00007, price_per_1k_output: 0.00027, context_window: 1000000, capabilities: ['chat', 'vision'] },
  ];
  res.json({ models });
});

export default router;
