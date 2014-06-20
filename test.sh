#!/bin/sh

source env/bin/activate
./manage.py test --settings=reformedacademy.local_settings
