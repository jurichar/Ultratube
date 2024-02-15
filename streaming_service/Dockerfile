FROM node:21.5.0

WORKDIR /app

COPY . .

RUN npm install \
  && npm run build

EXPOSE 8001

ENTRYPOINT ["npm", "run", "start"]
