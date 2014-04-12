#!/bin/sh

source env/bin/activate
./manage.py test --settings=rfmedia.local_settings
