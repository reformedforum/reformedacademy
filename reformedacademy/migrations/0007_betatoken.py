# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        ('reformedacademy', '0006_auto_20140915_0251'),
    ]

    operations = [
        migrations.CreateModel(
            name='BetaToken',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('token', models.CharField(max_length=5)),
                ('redeemed', models.DateTimeField(blank=True)),
                ('invited_by', models.ForeignKey(related_name=b'invited_token', blank=True, to=settings.AUTH_USER_MODEL, null=True)),
                ('redeemed_by', models.ForeignKey(related_name=b'redeemed_token', blank=True, to=settings.AUTH_USER_MODEL, null=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
    ]
