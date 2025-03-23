# Stage 1: Build the app
FROM node:18 AS build

WORKDIR /app

# Устанавливаем зависимости
COPY package.json yarn.lock ./
RUN yarn

# Копируем исходный код
COPY . ./

# Строим приложение
RUN yarn build

# Stage 2: Serve the app
FROM nginx:alpine

# Копируем сгенерированные файлы
COPY --from=build /app/dist /usr/share/nginx/html

# Открываем порт 80 для Nginx
EXPOSE 80

CMD ["yarn","preview"]
