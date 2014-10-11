# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('reformedacademy', '0008_auto_20141004_1835'),
    ]

    operations = [
        migrations.AddField(
            model_name='course',
            name='published',
            field=models.DateTimeField(null=True, blank=True),
            preserve_default=True,
        ),
    ]
