# TokenProxy 多通道熔断 MVP 方案

> **角色**：小痴｜运维负责人
> **日期**：2026-04-15
> **状态**：第二优先任务，2-3天基础版

---

## 0. 背景与目标

### 当前状态
- 上游单一通道：**硅基流动（siliconflow）**
- 现状风险：硅基流动故障时，整个代理站瘫痪，用户全部流失
- 技术债：没有任何通道监控和自动切换能力

### MVP 目标（2-3天完成）
1. **熔断器**：检测上游故障，3次连续失败自动熔断
2. **自动切换**：熔断后自动切换到备用通道，用户无感知
3. **告警**：熔断触发时立即通知负责人
4. **最小化备用通道**：不要求完美备份，但要能顶住第一波故障

### 非 MVP 目标（后续迭代）
- 多通道负载均衡
- 精细化健康检测（定时 ping + 真实请求探测）
- 管理后台看通道状态
- Redis 持久化熔断状态

---

## 1. 架构设计

### 1.1 双通道模型

```
用户请求
    │
    ▼
┌─────────────────────┐
│   熔断器控制器       │
│  (CircuitBreaker)   │
│                     │
│  primary: siliconflow│
│  backup:  TBD        │
└──────────┬──────────┘
           │
    ┌──────┴──────┐
    │ 状态判断     │
    └──────┬──────┘
           │
   ┌───────┴───────┐
   │               │
   ▼               ▼
 primary        backup
 siliconflow    (待定)
   [OK]           [OK]
```

### 1.2 熔断器状态机

```
        ┌─────────────────────────────────────┐
        │                                     │
        ▼                                     │
   ┌─────────┐  连续失败≥3次   ┌─────────┐  冷却30s后   ┌────────────┐
   │ CLOSED  │ ──────────────▶│  OPEN   │ ────────────▶│ HALF_OPEN │
   │ 正常    │                │ 已熔断  │              │ 试探恢复   │
   └────┬────┘                └─────────┘              └─────┬──────┘
        ▲                                                 │
        │                                                 │
        │           试探成功              试探失败        │
        └──────────────────────  ────────────────────────┘
```

| 状态 | 含义 | 行为 |
|------|------|------|
| CLOSED | 正常 | 所有请求发往 primary |
| OPEN | 熔断中 | 所有请求发往 backup |
| HALF_OPEN | 试探恢复 | 允许 1 个请求去 primary 试探 |

### 1.3 故障检测规则

满足以下任一条件即算"失败"：
1. HTTP 状态码 ≥ 500
2. HTTP 状态码 = 429（限流，连续触发更严重）
3. 响应延迟 > 30 秒（超时）
4. 连接错误 / 网络错误

---

## 2. 备用通道方案

### 2.1 短期方案（2-3天MVP）

**不强制要求备用通道立即可用，先做熔断+告警。**

原因：
1. 备用通道需要申请账号、测试连通性，2天内不一定搞定
2. 熔断+告警本身就解决了"不知道上游挂了"的问题
3. 有了告警，人工切换也能撑过第一波

**备用通道候选：**
- OpenRouter（国际，中转，质量稳定）
- CloseAI（国内，镜像，速度快）
- 第二账号硅基流动（同一个平台，配置最简单）

### 2.2 推荐的 2 天方案

```
Day 1:
- 接入第二个 siliconflow 账号（同一平台，配置最简）
- 实现熔断器状态机
- 实现请求级切换逻辑
- 接入飞书告警

Day 2:
- 配置第二个账号的 API Key
- 完整测试：模拟 primary 故障，观察自动切换
- 写运维手册（故障处理 SOP）
```

**为什么推荐第二个 siliconflow 账号作为 backup？**
- 同一平台，API 格式完全一致，切换代码改动最少
- 成本最低（不需要额外服务商账号）
- 缺点：同平台故障可能同时挂（但硅基流动故障通常是单账号限流，不是全平台挂）

---

## 3. 技术实现

### 3.1 文件结构

```
backend/src/
├── circuitBreaker.js      # ★ 熔断器核心（新增）
├── routes/
│   └── proxy.js           # 修改：集成熔断器
├── services/
│   └── healthCheck.js      # ★ 健康检测服务（新增）
└── alerts/
    └── feishuAlert.js      # ★ 飞书告警（新增）
```

### 3.2 熔断器核心（circuitBreaker.js）

```javascript
// 熔断器状态
const CircuitState = {
  CLOSED: 'CLOSED',       // 正常
  OPEN: 'OPEN',           // 熔断
  HALF_OPEN: 'HALF_OPEN', // 试探
};

// 配置
const CONFIG = {
  failureThreshold: 3,      // 连续失败多少次后熔断
  recoveryTimeout: 30000,  // 熔断后多少 ms 切换到 HALF_OPEN
  halfOpenRequests: 1,     // HALF_OPEN 时放行几个请求试探
};

class CircuitBreaker {
  constructor(name, primaryProvider, backupProvider) {
    this.name = name;
    this.primary = primaryProvider;
    this.backup = backupProvider;
    this.state = CircuitState.CLOSED;
    this.failureCount = 0;
    this.lastFailureTime = null;
    this.halfOpenCount = 0;
  }

  // 判断当前应该用哪个 provider
  getActiveProvider() {
    if (this.state === CircuitState.OPEN) {
      return this.backup;
    }
    return this.primary;
  }

  // 记录成功
  recordSuccess() {
    this.failureCount = 0;
    this.state = CircuitState.CLOSED;
    this.halfOpenCount = 0;
  }

  // 记录失败
  recordFailure() {
    this.lastFailureTime = Date.now();
    this.failureCount++;

    if (this.state === CircuitState.HALF_OPEN) {
      // 试探状态失败，重新熔断
      this.state = CircuitState.OPEN;
      this.sendAlert(`[${this.name}] 试探失败，重新熔断`);
      return;
    }

    if (this.state === CircuitState.CLOSED && this.failureCount >= CONFIG.failureThreshold) {
      this.state = CircuitState.OPEN;
      this.sendAlert(`[${this.name}] 熔断触发！连续${this.failureCount}次失败，已切换到备用通道`);
    }
  }

  // 检查是否应该切换到 HALF_OPEN
  tryOpenHalfOpen() {
    if (this.state !== CircuitState.OPEN) return;
    if (Date.now() - this.lastFailureTime < CONFIG.recoveryTimeout) return;

    this.state = CircuitState.HALF_OPEN;
    this.halfOpenCount = 0;
    this.sendAlert(`[${this.name}] 进入试探恢复阶段`);
  }

  sendAlert(message) {
    // 告警逻辑（见 3.4）
  }
}
```

### 3.3 集成到 proxy.js

```javascript
import CircuitBreaker from '../circuitBreaker.js';

// 初始化熔断器
const siliconflowBreaker = new CircuitBreaker(
  'siliconflow',
  { name: 'primary', baseURL: config.upstream.siliconflow },
  { name: 'backup',  baseURL: config.upstream.siliconflowBackup }
);

// 改造 getUpstream()
function getUpstream(req) {
  // 先检查是否该试探恢复
  siliconflowBreaker.tryOpenHalfOpen();

  const provider = siliconflowBreaker.getActiveProvider();

  // 标记当前用的是哪个（用于计费/日志）
  req.currentProvider = provider.name;
  return provider.baseURL;
}

// 改造 axios 调用层
// 在现有 try/catch 中增加：
try {
  const upstreamRes = await axios({ ... });

  // 判断是否失败
  const isFailed = upstreamRes.status >= 500
    || upstreamRes.status === 429
    || latencyMs > 30000;

  if (isFailed) {
    siliconflowBreaker.recordFailure();
  } else {
    siliconflowBreaker.recordSuccess();
  }
} catch (err) {
  siliconflowBreaker.recordFailure();
}
```

### 3.4 告警方案

**飞书机器人告警（最简单，5 分钟接入）**

```javascript
// alerts/feishuAlert.js
import axios from 'axios';

const FEISHU_WEBHOOK = process.env.FEISHU_ALERT_WEBHOOK;

export async function sendAlert(message) {
  if (!FEISHU_WEBHOOK) {
    console.warn('[Alert] 未配置飞书告警 Webhook，跳过告警');
    return;
  }

  try {
    await axios.post(FEISHU_WEBHOOK, {
      msg_type: 'text',
      content: { text: `🔴 TokenProxy 告警\n${message}` },
    });
  } catch (err) {
    console.error('[Alert] 飞书告警发送失败:', err.message);
  }
}
```

**告警触发条件：**
| 事件 | 告警内容 |
|------|---------|
| 熔断触发 | `🔴 [TokenProxy] siliconflow 主通道熔断！连续3次失败，已切换备用通道` |
| 试探失败 | `🟡 [TokenProxy] siliconflow 试探失败，重新熔断` |
| 恢复成功 | `✅ [TokenProxy] siliconflow 恢复，已切换回主通道` |
| 主通道连续失败N次 | `🔴 [TokenProxy] siliconflow 主通道异常！累计N次失败` |

---

## 4. 部署与配置

### 4.1 环境变量

```bash
# 通道配置
UPSTREAM_SILICONFLOW_URL=https://api.siliconflow.cn/v1
UPSTREAM_SILICONFLOW_KEY=sk-xxx
UPSTREAM_SILICONFLOW_BACKUP_URL=https://api.siliconflow.cn/v1
UPSTREAM_SILICONFLOW_BACKUP_KEY=sk-xxx-2

# 熔断配置
CIRCUIT_FAILURE_THRESHOLD=3
CIRCUIT_RECOVERY_TIMEOUT_MS=30000

# 告警
FEISHU_ALERT_WEBHOOK=https://open.feishu.cn/open-apis/bot/v2/hook/xxx
```

### 4.2 熔断状态持久化

**MVP 阶段不做 Redis 持久化**，原因：
- 进程重启后熔断状态丢失，会重新从 primary 开始
- 短期影响：进程重启的瞬间可能打在正在恢复的通道上
- 接受这个风险，等后续上 Redis 再补

---

## 5. 测试计划

### 5.1 模拟故障测试（必须做）

```bash
# 1. 熔断触发测试
# 临时把 siliconflow KEY 改成错误的，模拟连续失败
# 观察：3次失败后是否触发熔断、是否收到飞书告警

# 2. 自动切换测试
# 熔断后请求是否打到 backup 通道

# 3. 恢复测试
# 恢复正确 KEY，观察30秒后是否进入 HALF_OPEN
# 发出试探请求，确认成功后是否恢复到 CLOSED
```

### 5.2 回归测试

- 正常请求流程不受影响
- 计费逻辑不受影响
- 流式响应不受影响

---

## 6. 迭代路线图

### Phase 1（MVP，2-3天）★ 当前
- 熔断器状态机（CLOSED / OPEN / HALF_OPEN）
- 主备通道切换
- 飞书告警
- 手动配置第二个 siliconflow 账号作为 backup

### Phase 2（1周内）
- OpenRouter 作为独立备用通道（国际节点，对冲硅基流动国内故障风险）
- 管理接口：查看当前通道状态、强制切换通道
- 日志增强：记录每次切换的原因

### Phase 3（2-3周）
- Redis 持久化熔断状态（进程重启不丢失）
- 定时健康探测（每 30s 对 upstream 发 HEAD 请求，更精准的健康判断）
- 监控大盘（Grafana + 请求量/失败率/通道延迟）

---

## 7. 风险与对策

| 风险 | 概率 | 影响 | 对策 |
|------|------|------|------|
| 硅基流动全平台故障，备用通道也用不了 | 低 | 高 | Phase 2 接入 OpenRouter 国际通道 |
| 熔断器本身有 bug，导致正常请求被拦截 | 中 | 高 | 测试覆盖 + 熔断时降级到"只发告警不拦截"模式 |
| 飞书 Webhook 失效，告警发不出去 | 低 | 中 | 增加邮件/钉钉备选告警 |
| 进程重启后熔断状态丢失 | 高 | 低 | Phase 3 上 Redis，先接受这个限制 |

---

## 8. 决策问题（需要老板拍板）

**Q1：备用通道选哪个？**

| 选项 | 优点 | 缺点 | 推荐 |
|------|------|------|------|
| 第二个硅基流动账号 | 接入快、0额外成本、API格式一致 | 同平台风险，不完全独立 | ✅ MVP推荐 |
| OpenRouter | 国际独立节点，风险分散 | 需要海外支付、延迟更高 | Phase 2 |
| CloseAI | 国内镜像，速度快 | 稳定性不如大厂 | Phase 2 备选 |

**Q2：Phase 1 要不要强制要求备用通道？**

- 方案A（推荐）：Phase 1 只做熔断+告警，备用通道配置成第二个硅基流动账号（不要求立即测试通过）
- 方案B：Phase 1 必须备用通道可用后再上线

**推荐方案A**。熔断+告警本身已经解决了"用户不知道上游挂了"的问题，至少可以及时告警、手动切换。备用通道是第二层保护，可以 Phase 1.5 或 Phase 2 再上。

---

## 9. 工作量估算

| 任务 | 工期 | 负责人 |
|------|------|-------|
| 熔断器核心类（circuitBreaker.js） | 0.5天 | 小傻 |
| 集成到 proxy.js | 0.5天 | 小傻 |
| 飞书告警接入 | 0.5天 | 小痴 |
| 第二个硅基流动账号申请+配置 | 0.5天 | 小痴 |
| 测试+调试 | 1天 | 小傻 |
| 运维手册（SOP） | 0.5天 | 小痴 |

**合计：约 3 天**

---

*小痴｜运维负责人｜2026-04-15*
