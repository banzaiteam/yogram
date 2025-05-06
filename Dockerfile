#Устанавливаем зависимости
FROM node:20.11-alpine as dependencies
WORKDIR /app

# Устанавливаем pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

COPY .npmrc ./
COPY pnpm-lock.yaml ./
COPY package.json ./

RUN pnpm install --frozen-lockfile



# Устанавливаем pnpm снова для этого слоя
RUN corepack enable && corepack prepare pnpm@latest --activate

COPY . ./
COPY --from=dependencies /app/node_modules ./node_modules

RUN npm run build:production



# Устанавливаем pnpm снова для рантайма

COPY --from=builder /app/ ./
EXPOSE 3000
CMD ["pnpm", "start"]
