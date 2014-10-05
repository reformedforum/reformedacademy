"""
Defines views for the rfmedia app.

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
from django.shortcuts import render, get_object_or_404, get_list_or_404
from models import Stat, Asset
from django.http import HttpResponseRedirect
from django.utils import timezone
from django.shortcuts import redirect
import os.path
import random
from ipware.ip import get_ip

def download(request, method, type, asset):
    # Remove extension from asset
    tag = os.path.splitext(asset)[0]
    assets = get_list_or_404(Asset, tag=tag, type__name=type, active=1)

    # Choose asset randomly
    asset = random.choice(assets)

    # Grab request META information
    ip = get_ip(request)
    useragent = request.META['HTTP_USER_AGENT']

    # If we don't have an IP or user agent throw a 404
    if not ip or not useragent:
        raise Http404

    referer = None
    if 'HTTP_REFERER' in request.META:
        referer = request.META['HTTP_REFERER']

    # Create the Stat object
    stat = Stat.objects.create(asset=asset, ip=ip, useragent=useragent, method=method,
                               referer=referer, created=timezone.now(), modified=timezone.now())

    # Make sure we have a stat object otherwise throw a 404
    if not stat:
        raise Http404

    return HttpResponseRedirect(asset.url)
