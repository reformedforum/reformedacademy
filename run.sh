#!/bin/sh

# Collect static files
python manage.py collectstatic --noinput

if [ "$SERVER_ENVIRONMENT" != "prod" ]; then
	# Wait for the DB to warm up
	until nc -z db 3306; do
		echo "$(date) - waiting for mysql..."
		sleep 1
	done
fi

# Run any pending migrations.
python manage.py migrate --noinput

if [ "$SERVER_ENVIRONMENT" = "prod" ]; then
    /etc/init.d/nginx start
    gunicorn -b unix:/tmp/gunicorn.sock kapi.wsgi
else
    python manage.py runserver 0.0.0.0:8000
fi