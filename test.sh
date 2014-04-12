#!/bin/sh

source env/bin/activate
./manage.py test --settings=gomoto.local_settings
