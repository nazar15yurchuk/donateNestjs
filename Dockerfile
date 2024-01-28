
FROM node:18-alpine as builder

RUN mkdir app
COPY package*.json /app
COPY tsconfig*.json /app
WORKDIR /app

RUN npm install
RUN npm run build


FROM node:18-alpine

WORKDIR /app
COPY --from=builder /app/dist/ ./app/dist
COPY --from=builder /app/ /app/

RUN npm install



