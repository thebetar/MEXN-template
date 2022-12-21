FROM node:alpine as builder

WORKDIR /app

COPY package*.json .

RUN npm ci

COPY . .
COPY tsconfig.json .

RUN npm run build

FROM node:alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist .

EXPOSE 3000

CMD [ "node", "index" ]