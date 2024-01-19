#!/usr/bin/env bash

./manage.py makemigrations
./manage.py migrate
./manage.py init_local_dev 
./manage.py runserver 0.0.0.0:8000
