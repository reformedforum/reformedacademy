# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('reformedacademy', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='instructor',
            name='course',
        ),
        migrations.DeleteModel(
            name='Instructor',
        ),
        migrations.AddField(
            model_name='user',
            name='biography',
            field=models.TextField(default='', blank=True),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='user',
            name='course',
            field=models.ManyToManyField(to='reformedacademy.Course', blank=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='user',
            name='name',
            field=models.CharField(default='', max_length=255),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='user',
            name='profile_image',
            field=models.ImageField(default='', upload_to=b'profile_images/instructors'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='user',
            name='slug',
            field=models.SlugField(default='', max_length=255),
            preserve_default=False,
        ),
    ]
