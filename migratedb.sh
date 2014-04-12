#!/bin/bash

source env/bin/activate
./manage.py syncdb --settings=gomoto.local_settings
./manage.py migrate --settings=gomoto.local_settings