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
from django.contrib.auth import get_user_model
from django.db import models
from django.contrib.auth.models import AbstractUser
from rfmedia.models import Asset
from urlparse import urlparse
import scriptures


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


class User(AbstractUser):
    courses = models.ManyToManyField(Course, through="Membership")


class Membership(models.Model):
    user = models.ForeignKey(User)
    course = models.ForeignKey(Course)
    dropped = models.BooleanField()
    completed = models.BooleanField()


class ActivationKey(models.Model):
    """Describes an activation key.

    This is used for activating a user after they sign up with an email address.
    """
    user = models.ForeignKey(User)
    key = models.CharField(max_length=255)
    sent = models.DateTimeField(auto_now=True)


class Lesson(models.Model):
    """Describes a lesson.

    Lessons have many tasks associated with them.
    """
    course = models.ForeignKey(Course)
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255)
    description = models.TextField()
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __unicode__(self):
        return self.name


class Author(models.Model):
    """Describes an author."""
    name = models.CharField(max_length=255)

    def __unicode__(self):
        return self.name


class Book(models.Model):
    """Describes a book."""
    title = models.CharField(max_length=255)
    authors = models.ManyToManyField(Author, blank=True)
    cover_image = models.ImageField(upload_to='cover_images')

    def __unicode__(self):
        return self.title


class BookURL(models.Model):
    """Describes a book url.

    There are multiple urls to a book that may want to be linked to.

    """
    book = models.ForeignKey(Book)
    url = models.URLField()

    @property
    def website(self):
        parse = urlparse(self.url)
        return parse.netloc.replace('www.', '')


class BookISBN(models.Model):
    """Describes a book ISBN.

    There may be multiple versions of a book and I want them all pointing to the same book.
    This is a one to many relationship.

    """
    book = models.ForeignKey(Book)
    isbn10 = models.CharField(max_length=10)
    isbn13 = models.CharField(max_length=14)


class Task(models.Model):
    """Describes a task.

    A task could be a many things, including reading, listening, or watching something.
    """
    lesson = models.ForeignKey(Lesson)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    order = models.PositiveIntegerField(default=0)
    book = models.ForeignKey(Book, blank=True, null=True, on_delete=models.PROTECT)
    asset = models.ForeignKey(Asset, blank=True, null=True, on_delete=models.PROTECT)

    def save(self, *args, **kwargs):
        super(Task, self).save(*args, **kwargs)

        # Get passages from the lesson name
        passages = PassageIndex.extract_from_string(self.name)

        # Check to see if passages are in taskpassage_set. If they aren't, add them.
        for p in passages:
            if p not in self.passageindex_set.all():
                p.task = self
                p.save()

    class Meta:
        ordering = ['order']

    def __unicode__(self):
        return '{}'.format(self.name)


class PassageIndex(models.Model):
    """Describes a passage index.

    This is used to index passages associated with different things for searching.

    """
    start_verse = VerseField()
    end_verse = VerseField()
    task = models.ForeignKey(Task, blank=True, null=True)
    book = models.ForeignKey(Book, blank=True, null=True)

    def __eq__(self, other):
        if not isinstance(other, PassageIndex):
            return False
        return self.start_verse == other.start_verse and self.end_verse == other.end_verse

    @staticmethod
    def extract_from_string(value):
        """Extracts passages from a string.

         @:returns List of passages.

         """

        # Extract scriptures from the name of the task to automatically add
        # scripture relationships.
        # e.g. [('Romans', 3, 23, 3, 28), ('I John', 2, 1, 2, 29)]
        passages = []
        references = scriptures.extract(value)
        for (book, from_chapter, from_verse, to_chapter, to_verse) in references:
            start_verse = '{book} {chapter}:{verse}'.format(
                book=book,
                chapter=from_chapter,
                verse=from_verse
            )
            end_verse = '{book} {chapter}:{verse}'.format(
                book=book,
                chapter=to_chapter,
                verse=to_verse
            )
            passages.append(PassageIndex(start_verse=start_verse, end_verse=end_verse))

        return passages


class Instructor(models.Model):
    """Describes an instructor of a course."""
    course = models.ManyToManyField(Course, blank=True)
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255)
    biography = models.TextField(blank=True)
    profile_image = models.ImageField(upload_to='profile_images/instructors')

    def __unicode__(self):
        return self.name
