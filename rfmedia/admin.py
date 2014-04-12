"""admin.py

Defines administration functionality for the rfmedia app.

Created by kabucey.

"""

from django.contrib import admin
from django.utils.html import format_html
import models

admin.site.register(models.Asset)
admin.site.register(models.Stat)
admin.site.register(models.Type)
