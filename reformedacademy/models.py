"""
Defines models for the reformedacademy app.

Copyright (C) 2014 by Reformed Forum <reformedforum.org>

This file is part of Reformed Academy.

Reformed Academy is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Reformed Academy is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with Reformed Academy.  If not, see <http://www.gnu.org/licenses/>.

"""
from bible.djangoforms import VerseField
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

    class Meta:
        ordering = ['order']

    def __unicode__(self):
        return self.name


class Task(models.Model):
    """Describes a task.

    A task could be a many things, including reading, listening, or watching something.
    """
    lesson = models.ForeignKey(Lesson)
    asset = models.ForeignKey(Asset, on_delete=models.PROTECT)
    name = models.CharField(max_length=255)
    description = models.TextField()
    order = models.PositiveIntegerField()

    class Meta:
        ordering = ['order']

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


class Passage(models.Model):
    start_verse = VerseField()
    end_verse = VerseField()

    class Meta:
        abstract = True


class TaskPassage(Passage):
    task = models.ForeignKey(Task)
