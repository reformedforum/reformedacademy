# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Asset',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('tag', models.CharField(max_length=255, null=True, blank=True)),
                ('url', models.CharField(max_length=255, null=True, blank=True)),
                ('filesize', models.BigIntegerField(null=True, blank=True)),
                ('duration', models.CharField(max_length=255, null=True, blank=True)),
                ('mime_type', models.CharField(max_length=255, null=True, blank=True)),
                ('thumbnail_url', models.CharField(max_length=255, null=True, blank=True)),
                ('active', models.IntegerField()),
                ('created', models.DateTimeField()),
                ('modified', models.DateTimeField(null=True, blank=True)),
            ],
            options={
                'db_table': 'assets',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Stat',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('ip', models.CharField(max_length=255, blank=True)),
                ('useragent', models.CharField(max_length=255, blank=True)),
                ('referer', models.CharField(max_length=255, blank=True)),
                ('method', models.CharField(max_length=4, blank=True)),
                ('country_code', models.CharField(max_length=45, blank=True)),
                ('country_name', models.CharField(max_length=255, blank=True)),
                ('region_code', models.CharField(max_length=45, blank=True)),
                ('region_name', models.CharField(max_length=45, blank=True)),
                ('city', models.CharField(max_length=255, blank=True)),
                ('zipcode', models.CharField(max_length=45, blank=True)),
                ('metrocode', models.CharField(max_length=45, blank=True)),
                ('latitude', models.FloatField(null=True, blank=True)),
                ('longitude', models.FloatField(null=True, blank=True)),
                ('created', models.DateTimeField()),
                ('modified', models.DateTimeField(null=True, blank=True)),
                ('asset', models.ForeignKey(to='rfmedia.Asset')),
            ],
            options={
                'db_table': 'stats',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Type',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=255, null=True, blank=True)),
                ('created', models.DateTimeField()),
                ('modified', models.DateTimeField(null=True, blank=True)),
            ],
            options={
                'db_table': 'types',
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='asset',
            name='type',
            field=models.ForeignKey(to='rfmedia.Type'),
            preserve_default=True,
        ),
    ]
