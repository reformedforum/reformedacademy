#!/bin/bash

source env/bin/activate
./manage.py syncdb --settings=reformedacademy.local_settings
./manage.py migrate --settings=reformedacademy.local_settings
