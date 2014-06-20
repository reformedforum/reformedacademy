#!/bin/bash

source env/bin/activate
./manage.py runserver --settings=reformedacademy.local_settings
