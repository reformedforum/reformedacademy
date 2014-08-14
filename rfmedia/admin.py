"""rfmedia views.py

Administrative configuration for the rfmedia app.

Created by kabucey

"""
from django.contrib import admin
from models import Stat, Asset, Type


class AssetAdmin(admin.ModelAdmin):
    search_fields = ['tag']

admin.site.register(Stat)
admin.site.register(Asset, AssetAdmin)
admin.site.register(Type)
