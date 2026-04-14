FROM node:18-alpine

WORKDIR /app

# 复制整个项目
COPY . .

# 安装后端依赖
WORKDIR /app/server
RUN npm install

# 安装前端依赖并构建
WORKDIR /app/client
RUN npm install && npm run build

# 返回项目根目录
WORKDIR /app

# 暴露端口
EXPOSE 3001

# 启动服务
CMD ["node", "server/index.js"]
