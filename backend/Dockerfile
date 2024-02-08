FROM python:3.12.1

USER root

ENV LD_LIBRARY_PATH=/usr/local/lib/python3.12/site-packages/

WORKDIR /usr/local

RUN apt update -y \
      && apt upgrade -y \
      && apt install python3-libtorrent libtorrent-dev -y \
      && python3 -m pip install --upgrade pip setuptools wheel \
      && python3 -m pip install lbry-libtorrent 

WORKDIR /app/backend

COPY . .

RUN chmod +x ./wait-for-it.sh
RUN chmod +x ./start.sh

RUN pip install -r requirements.txt

EXPOSE 8000

# USER nobody

ENTRYPOINT ["./wait-for-it.sh", "db:5432", "--", "./start.sh"]
