"""rfmedia/views.py

"""
from django.shortcuts import render, get_object_or_404, get_list_or_404
from rfmedia.models import Stat, Asset
from django.http import HttpResponseRedirect
from django.utils import timezone
from django.shortcuts import redirect
import os.path
import random

def download(request, method, type, asset):
    # Remove extension from asset
    tag = os.path.splitext(asset)[0]
    assets = get_list_or_404(Asset, tag=tag, type__name=type, active=1)

    # Choose asset randomly
    asset = random.choice(assets)

    # Log access to file
    ip = request.META['REMOTE_ADDR']
    useragent = request.META['HTTP_USER_AGENT']
    referer = None
    if 'HTTP_REFERER' in request.META:
        referer = request.META['HTTP_REFERER']

    Stat.objects.create(asset=asset, ip=ip, useragent=useragent, method=method, referer=referer,
                        created=timezone.now(), modified=timezone.now())

    return HttpResponseRedirect(asset.url)
