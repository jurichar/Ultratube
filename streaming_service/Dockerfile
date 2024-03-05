FROM node:21.5.0

WORKDIR /app

COPY . .

RUN npm install \
  && npm run build \
  && mkdir -p /app/torrents/metadata

EXPOSE 8001

ENV ADDRESS=0.0.0.0 PORT=8001

CMD ["npm", "run", "dev"]
