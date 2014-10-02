"""
Defines beta signups middleware for the reformedacademy app.

Copyright (C) 2014 by Reformed Forum <reformedforum.org>

This file is part of Reformed Academy.

Reformed Academy is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Reformed Academy is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with Reformed Academy.  If not, see <http://www.gnu.org/licenses/>.

"""
from django.http import HttpResponseRedirect
import reformedacademy


class BetaSignupsMiddleware:
    def process_view(self, request, view_func, view_args, view_kwargs):
        if view_func == reformedacademy.views.courses:
            return HttpResponseRedirect('/')
        else:
            return None
