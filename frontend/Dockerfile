# frontend/Dockerfile
FROM node:18

WORKDIR /app/frontend

COPY package.json .

COPY . /app/frontend

RUN yarn

EXPOSE 3000

CMD ["yarn", "dev"]