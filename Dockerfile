FROM node:18-alpine
WORKDIR /app
COPY server/package*.json ./
RUN cd server && npm install
COPY client/package*.json ./
RUN cd client && npm install
COPY server/ ./server/
COPY client/ ./client/
RUN cd client && npm run build
EXPOSE 3001
CMD ["node", "server/index.js"]
