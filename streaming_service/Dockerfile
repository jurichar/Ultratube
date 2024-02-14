FROM node:18.16.1

WORKDIR /app

COPY . .

RUN npm install \
  && npm run build

EXPOSE 8001

ENTRYPOINT ["npm", "run", "start"]
