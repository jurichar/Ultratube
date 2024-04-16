FROM node:21.5.0

WORKDIR /app

COPY . .

RUN mkdir -p /app/torrents/metadata

RUN npm install \
  && npm run build

EXPOSE 8001

ENV PORT=8001

CMD ["npm", "run", "start:prod"]
