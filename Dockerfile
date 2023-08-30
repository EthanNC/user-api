FROM node:18-slim AS base

RUN npm i -g pnpm

FROM base AS dependencies
WORKDIR /app
COPY src ./src
COPY package.json pnpm-lock.yaml ./
COPY tsconfig*.json ./
RUN pnpm install --frozen-lockfile
RUN pnpm build

COPY . .

EXPOSE 3000

CMD ["pnpm", "start"]
