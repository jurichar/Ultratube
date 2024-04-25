FROM node:21.5.0

WORKDIR /app/streaming

COPY package.json .
COPY . .

RUN yarn install

RUN mkdir -p torrents \
      && mkdir -p torrents/metadata \
      && mkdir -p subtitles

EXPOSE 8001

ENV PORT=8001

CMD ["yarn", "start:prod"]
