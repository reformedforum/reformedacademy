"""reformedacademy models.py

Defines models for the reformedacademy app.

Created by kabucey

"""
from django.db import models
from django.contrib.auth.models import User
from rfmedia.models import Asset


class ActivationKey(models.Model):
    user = models.ForeignKey(User)
    key = models.CharField(max_length=255)
    sent = models.DateTimeField(auto_now=True)


class Category(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255)

    def __unicode__(self):
        return self.name


class Course(models.Model):
    category = models.ForeignKey(Category)
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255)
    description = models.TextField()

    def __unicode__(self):
        return self.name


class Lesson(models.Model):
    course = models.ForeignKey(Course)
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255)
    description = models.TextField()
    order = models.PositiveIntegerField()

    def __unicode__(self):
        return self.name


class Task(models.Model):
    lesson = models.ForeignKey(Lesson)
    asset = models.ForeignKey(Asset, on_delete=models.PROTECT)
    order = models.PositiveIntegerField()

    def __unicode__(self):
        return '{} {}'.format(self.lesson, self.asset.tag)


class Teacher(models.Model):
    course = models.ManyToManyField(Course)
    name = models.CharField(max_length=255)
    biography = models.TextField()
    profile_image = models.ImageField(upload_to='profile_images/teachers')
