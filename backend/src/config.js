import 'dotenv/config';

export default {
  port: process.env.PORT || 3001,
  jwtSecret: process.env.JWT_SECRET || 'token-proxy-jwt-secret-2026',
  jwtExpiresIn: '7d',
  dbPath: process.env.DB_PATH || '../data/token-proxy.db',
  upstream: {
    openai: process.env.OPENAI_BASE_URL || 'https://api.openai.com',
    anthropic: process.env.ANTHROPIC_BASE_URL || 'https://api.anthropic.com',
    google: process.env.GOOGLE_BASE_URL || 'https://generativelanguage.googleapis.com',
  },
  // 默认模型配置 (元/百万tokens)
  defaultPrices: {
    'gpt-4o':          { input: 10, output: 30 },
    'gpt-4o-mini':     { input: 1.5, output: 6 },
    'gpt-4-turbo':     { input: 30, output: 90 },
    'gpt-3.5-turbo':  { input: 0.5, output: 1.5 },
    'claude-3-5-sonnet': { input: 7, output: 21 },
    'claude-3-5-haiku':  { input: 0.8, output: 4 },
    'gemini-1.5-pro':  { input: 5, output: 15 },
    'gemini-1.5-flash': { input: 0.25, output: 0.75 },
  },
};
