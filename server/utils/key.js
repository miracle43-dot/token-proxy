import { v4 as uuidv4 } from 'uuid';

// 生成sk-开头的API Key（兼容OpenAI格式）
export function generateApiKey() {
  const uuid = uuidv4().replace(/-/g, '');
  return `sk-${uuid}`;
}

// 生成订单号
export function generateOrderId() {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `ORD${timestamp}${random}`.toUpperCase();
}
