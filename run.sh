#!/bin/sh

cd /home/docker/code

# Collect static files
python3 manage.py collectstatic --noinput

# Run any pending migrations.
python3 manage.py migrate --noinput

supervisord -n