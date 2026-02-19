FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --ignore-scripts

COPY . .

RUN mkdir -p uploads

EXPOSE 3001

CMD ["npx", "ts-node", "./Backend/server.ts"]
