# 1. Устанавливаем зависимости
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# 2. Собираем проект
FROM node:20-alpine AS builder
WORKDIR /app
COPY . .                            
COPY --from=deps /app/node_modules ./node_modules  
RUN yarn build   

# 3. Запускаем контейнер
FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Открываем порт 4173 для Nginx
EXPOSE 4173
CMD ["yarn", "preview", "--host", "--port", "3000"]

# # 1. Сборка Vite проекта
# FROM node:20-alpine AS builder
# WORKDIR /app
# COPY package.json yarn.lock ./
# RUN yarn install --frozen-lockfile
# COPY . .
# RUN yarn build

# # 2. Nginx для сервировки
# FROM nginx:alpine AS runner
# # Удалим дефолтный index.html nginx
# RUN rm -rf /usr/share/nginx/html/*

# # Копируем сборку из Vite
# COPY --from=builder /app/dist /usr/share/nginx/html

# # Копируем кастомный nginx.conf
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]
