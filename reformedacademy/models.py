"""reformedacademy models.py

Defines models for the reformedacademy app.

Created by kabucey

"""
from django.db import models
from django.contrib.auth.models import User
from rfmedia.models import Asset


class ActivationKey(models.Model):
    """Describes an activation key.

    This is used for activating a user after they sign up with an email address.
    """
    user = models.ForeignKey(User)
    key = models.CharField(max_length=255)
    sent = models.DateTimeField(auto_now=True)


class Category(models.Model):
    """Describes a category.

    These are used to categorize courses.
    """
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255)

    def __unicode__(self):
        return self.name


class Course(models.Model):
    """Describes a course.

    Courses have many lessons associated with them.
    """
    category = models.ForeignKey(Category)
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255)
    description = models.TextField()

    def __unicode__(self):
        return self.name


class Lesson(models.Model):
    """Describes a lesson.

    Lessons have many tasks associated with them.
    """
    course = models.ForeignKey(Course)
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255)
    description = models.TextField()
    order = models.PositiveIntegerField()

    def __unicode__(self):
        return self.name


class Task(models.Model):
    """Describes a task.

    A task could be a many things, including reading, listening, or watching something.
    """
    lesson = models.ForeignKey(Lesson)
    asset = models.ForeignKey(Asset, on_delete=models.PROTECT)
    order = models.PositiveIntegerField()

    def __unicode__(self):
        return '{} {}'.format(self.lesson, self.asset.tag)


class Instructor(models.Model):
    """Describes an instructor of a course."""
    course = models.ManyToManyField(Course, blank=True)
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255)
    biography = models.TextField(blank=True)
    profile_image = models.ImageField(upload_to='profile_images/instructors')

    def __unicode__(self):
        return self.name
