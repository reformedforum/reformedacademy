#!/bin/bash
#
# Migrates a database to the most recent version.
#
# Copyright (C) 2014 by Reformed Forum <reformedforum.org>
#
# This file is part of Reformed Academy.
#
# Reformed Academy is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# Reformed Academy is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with Reformed Academy.  If not, see <http://www.gnu.org/licenses/>.

source env/bin/activate
./manage.py syncdb --settings=reformedacademy.local_settings
./manage.py migrate --settings=reformedacademy.local_settings
