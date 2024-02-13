FROM python:3.12.1

USER root

WORKDIR /app/backend

COPY . .

RUN chmod +x ./wait-for-it.sh
RUN chmod +x ./start.sh

RUN pip install -r requirements.txt

EXPOSE 8000

# USER nobody

ENTRYPOINT ["./wait-for-it.sh", "db:5432", "--", "./start.sh"]
