#!/usr/bin/env python
#
# Creates a default administrator account.
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
from reformedacademy.models import User

if User.objects.count() == 0:
    admin = User.objects.create(username='admin')
    admin.set_password('admin')
    admin.is_superuser = True
    admin.is_staff = True
    admin.save()
