# frontend/Dockerfile
FROM node:18-alpine

WORKDIR /app/frontend

COPY . .

RUN yarn

EXPOSE 3000

CMD ["yarn", "dev"]