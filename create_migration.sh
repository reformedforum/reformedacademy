#!/bin/bash

source env/bin/activate
./manage.py schemamigration media --auto --settings=reformedacademy.local_settings
./manage.py schemamigration reformedacademy --auto --settings=reformedacademy.local_settings
