# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('reformedacademy', '0004_merge'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='name',
        ),
        migrations.RemoveField(
            model_name='user',
            name='slug',
        ),
        migrations.AlterField(
            model_name='user',
            name='profile_image',
            field=models.ImageField(upload_to=b'profile_images', blank=True),
        ),
    ]
