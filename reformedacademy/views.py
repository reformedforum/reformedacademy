"""reformedacademy views.py

Defines views for the reformedacademy app.

Created by kabucey

"""
from django.shortcuts import render, get_object_or_404, get_list_or_404
from django.http import HttpResponseRedirect
from django.utils import timezone
from django.shortcuts import redirect
import os.path
import random
from ipware.ip import get_ip


def index(request):
	return render(request, 'reformedacademy/index.html')
