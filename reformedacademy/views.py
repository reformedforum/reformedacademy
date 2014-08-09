"""reformedacademy views.py

Defines views for the reformedacademy app.

Created by kabucey

"""
from django.shortcuts import render, get_object_or_404, get_list_or_404, redirect
from django.contrib.auth import authenticate, login as auth_login
from django.core.urlresolvers import reverse
from django.http import HttpResponseRedirect
from django.utils import timezone
from django.contrib.auth.models import User
from django.contrib import messages
from ipware.ip import get_ip
import os.path
import random


def index(request):
	return render(request, 'reformedacademy/index.html')


def login(request):
    return render(request, 'reformedacademy/login.html')
