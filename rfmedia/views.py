"""rfmedia views.py

Defines views for the rfmedia app.

Created by kabucey

"""
from django.shortcuts import render, get_object_or_404, get_list_or_404
from rfmedia.models import Stat, Asset
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
