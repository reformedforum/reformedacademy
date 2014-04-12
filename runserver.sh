#!/bin/bash

source env/bin/activate
./manage.py runserver --settings=rfmedia.local_settings
