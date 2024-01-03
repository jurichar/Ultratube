# frontend/Dockerfile
FROM node:20.10.0

WORKDIR /app/frontend

COPY . .

RUN yarn install

EXPOSE 3000

CMD ["yarn", "dev"]