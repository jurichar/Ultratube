# frontend/Dockerfile
FROM node:21.5.0

WORKDIR /app/frontend

COPY package.json .
COPY yarn.lock .

RUN yarn install --frozen-lockfile

COPY . .

EXPOSE 3000

CMD ["yarn", "dev"]