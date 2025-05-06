#Устанавливаем зависимости
FROM node:20.11-alpine as dependencies
WORKDIR /app

# Устанавливаем pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

COPY .npmrc ./
COPY pnpm-lock.yaml ./
COPY package.json ./

RUN pnpm install --frozen-lockfile

# Сборка приложения
#Билдим приложение
#Кэширование зависимостей — если файлы в проекте изменились,
#но package.json остался неизменным, то стейдж с установкой зависимостей повторно не выполняется, что экономит время.
FROM node:20.11-alpine as builder
WORKDIR /app


# Устанавливаем pnpm снова для этого слоя
RUN corepack enable && corepack prepare pnpm@latest --activate

COPY . ./
COPY --from=dependencies /app/node_modules ./node_modules

RUN npm run build:production

#Стейдж запуска
FROM node:20.11-alpine as runner
WORKDIR /app
ENV NODE_ENV production

# Устанавливаем pnpm снова для рантайма
RUN corepack enable && corepack prepare pnpm@latest --activate

COPY --from=builder /app/ ./
EXPOSE 3000
CMD ["pnpm", "start"]
