# frontend/Dockerfile
FROM node:21.5.0

WORKDIR /app/frontend

COPY . .

RUN yarn

EXPOSE 3000

CMD ["yarn", "dev"]