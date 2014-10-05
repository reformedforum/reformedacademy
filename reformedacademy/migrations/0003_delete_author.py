# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('reformedacademy', '0002_auto_20140912_0109'),
    ]

    operations = [
        migrations.DeleteModel(
            name='Author',
        ),
    ]
