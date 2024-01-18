FROM python:3.12.1

WORKDIR /app/backend

COPY . .

USER root

RUN chmod +x ./wait-for-it.sh
RUN chmod +x ./start.sh

RUN pip install -r requirements.txt

EXPOSE 8000

USER nobody

ENTRYPOINT ["./wait-for-it.sh", "db:5432", "--", "./start.sh"]
