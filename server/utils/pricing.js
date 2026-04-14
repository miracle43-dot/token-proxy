// 模型定价配置（单位：元/百万tokens）
// 暂时使用固定配置，后续可从数据库读取
export const MODEL_PRICING = {
  // OpenAI
  'gpt-4o': { input: 10, output: 30 },
  'gpt-4o-mini': { input: 1.5, output: 6 },
  'gpt-4-turbo': { input: 70, output: 210 },
  'gpt-4': { input: 70, output: 210 },
  'gpt-3.5-turbo': { input: 1.5, output: 2 },
  // Claude
  'claude-3-5-sonnet': { input: 15, output: 75 },
  'claude-3-5-haiku': { input: 1.5, output: 6.25 },
  'claude-3-opus': { input: 100, output: 500 },
  'claude-3-sonnet': { input: 15, output: 75 },
  'claude-3-haiku': { input: 1.5, output: 6.25 },
  // Gemini
  'gemini-1.5-pro': { input: 10.5, output: 42 },
  'gemini-1.5-flash': { input: 0.525, output: 2.1 },
  'gemini-1.5-flash-8b': { input: 0.105, output: 0.42 },
  // DeepSeek
  'deepseek-chat': { input: 0.5, output: 2 },
  'deepseek-coder': { input: 0.5, output: 2 },
  // 默认
  'default': { input: 5, output: 15 },
};

export function getModelPrice(model) {
  // 尝试精确匹配
  if (MODEL_PRICING[model]) {
    return MODEL_PRICING[model];
  }
  // 尝试前缀匹配
  for (const [key, price] of Object.entries(MODEL_PRICING)) {
    if (model.startsWith(key)) {
      return price;
    }
  }
  return MODEL_PRICING['default'];
}

export function calculateCost(model, inputTokens, outputTokens) {
  const price = getModelPrice(model);
  const inputCost = (inputTokens / 1000000) * price.input;
  const outputCost = (outputTokens / 1000000) * price.output;
  return Math.round((inputCost + outputCost) * 10000) / 10000; // 保留4位小数
}
