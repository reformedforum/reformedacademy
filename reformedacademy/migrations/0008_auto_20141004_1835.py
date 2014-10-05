# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('reformedacademy', '0007_betatoken'),
    ]

    operations = [
        migrations.AlterField(
            model_name='betatoken',
            name='redeemed',
            field=models.DateTimeField(null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='betatoken',
            name='token',
            field=models.CharField(max_length=6),
        ),
    ]
