#!/bin/sh

cd /home/docker/code

# Collect static files
python3 manage.py collectstatic --noinput

# Run any pending migrations.
python3 manage.py migrate --noinput

if [ "$SERVER_ENVIRONMENT" = "prod" ]; then
    supervisord -n
else
    python3 manage.py runserver 0.0.0.0:8000
fi