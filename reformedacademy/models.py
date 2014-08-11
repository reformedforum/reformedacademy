"""reformedacademy models.py

Defines models for the reformedacademy app.

Created by kabucey

"""
from django.db import models
from django.contrib.auth.models import User


class ActivationKey(models.Model):
    user = models.ForeignKey(User)
    key = models.CharField(max_length=255)
    sent = models.DateTimeField(auto_now=True)