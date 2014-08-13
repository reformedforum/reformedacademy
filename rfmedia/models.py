"""rfmedia models.py

Defines models for the rfmedia app.

Created by kabucey

"""
from __future__ import unicode_literals
from django.db import models
from django.core.urlresolvers import reverse


class Type(models.Model):
    name = models.CharField(max_length=255, blank=True, null=True)
    created = models.DateTimeField()
    modified = models.DateTimeField(blank=True, null=True)

    class Meta:
        db_table = 'types'

    def __unicode__(self):
        return self.name


class Asset(models.Model):
    type = models.ForeignKey(Type)
    tag = models.CharField(max_length=255, blank=True, null=True)
    url = models.CharField(max_length=255, blank=True, null=True)
    filesize = models.BigIntegerField(blank=True, null=True)
    duration = models.CharField(max_length=255, blank=True, null=True)
    mime_type = models.CharField(max_length=255, blank=True, null=True)
    thumbnail_url = models.CharField(max_length=255, blank=True, null=True)
    active = models.IntegerField()
    created = models.DateTimeField()
    modified = models.DateTimeField(blank=True, null=True)

    @property
    def download_url(self):
        return reverse('download_asset', args=['web', self.type.name, '{}.mp3'.format(self.tag)])

    class Meta:
        db_table = 'assets'

    def __unicode__(self):
        return self.url


class Stat(models.Model):
    asset = models.ForeignKey(Asset)
    ip = models.CharField(max_length=255, blank=True)
    useragent = models.CharField(max_length=255, blank=True)
    referer = models.CharField(max_length=255, blank=True)
    method = models.CharField(max_length=4, blank=True)
    country_code = models.CharField(max_length=45, blank=True)
    country_name = models.CharField(max_length=255, blank=True)
    region_code = models.CharField(max_length=45, blank=True)
    region_name = models.CharField(max_length=45, blank=True)
    city = models.CharField(max_length=255, blank=True)
    zipcode = models.CharField(max_length=45, blank=True)
    metrocode = models.CharField(max_length=45, blank=True)
    latitude = models.FloatField(blank=True, null=True)
    longitude = models.FloatField(blank=True, null=True)
    created = models.DateTimeField()
    modified = models.DateTimeField(blank=True, null=True)

    class Meta:
        db_table = 'stats'

    def __unicode__(self):
        return '{} {}'.format(self.asset, self.ip)
