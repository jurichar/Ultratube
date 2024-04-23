FROM node:21.5.0

WORKDIR /app/streaming

COPY . .

RUN mkdir -p torrents \
  && mkdir -p torrents/metadata \
  && mkdir -p subtitles

RUN npm install

EXPOSE 8001

ENV PORT=8001

CMD ["npm", "run", "start:prod"]
