#!/bin/bash

source env/bin/activate
./manage.py schemamigration vehicles --auto --settings=gomoto.local_settings
./manage.py schemamigration gomoto --auto --settings=gomoto.local_settings
