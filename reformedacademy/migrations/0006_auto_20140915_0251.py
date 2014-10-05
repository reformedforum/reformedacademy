# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        ('reformedacademy', '0005_auto_20140912_0157'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='category',
            options={'verbose_name_plural': 'categories'},
        ),
        migrations.RemoveField(
            model_name='user',
            name='course',
        ),
        migrations.AddField(
            model_name='course',
            name='instructors',
            field=models.ManyToManyField(related_name=b'courses', to=settings.AUTH_USER_MODEL, blank=True),
            preserve_default=True,
        ),
    ]
