"""rfmedia views.py

Administrative configuration for the rfmedia app.

Created by kabucey

"""
from django.contrib import admin
from models import Stat, Asset, Type

admin.site.register(Stat)
admin.site.register(Asset)
admin.site.register(Type)
