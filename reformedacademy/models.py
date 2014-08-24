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
import scriptures


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

    def __unicode__(self):
        return self.title


class BookURL(models.Model):
    """Describes a book url.

    There are multiple urls to a book that may want to be linked to.

    """
    book = models.ForeignKey(Book)
    url = models.URLField()


class BookISBN(models.Model):
    """Describes a book ISBN.

    There may be multiple versions of a book and I want them all pointing to the same book.
    This is a one to many relationship.

    """
    book = models.ForeignKey(Book)
    isbn10 = models.IntegerField(max_length=10)
    isbn13 = models.IntegerField(max_length=13)


class Task(models.Model):
    """Describes a task.

    A task could be a many things, including reading, listening, or watching something.
    """
    lesson = models.ForeignKey(Lesson)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    order = models.PositiveIntegerField(default=0)
    books = models.ManyToManyField(Book, blank=True)

    def save(self, *args, **kwargs):
        super(Task, self).save(*args, **kwargs)

        # Get passages from the lesson name
        passages = TaskPassage.extract_from_string(self, self.name)

        # Check to see if passages are in taskpassage_set. If they aren't, add them.
        for p in passages:
            if p not in self.taskpassage_set.all():
                p.save()

    class Meta:
        ordering = ['order']

    def __unicode__(self):
        return '{}'.format(self.name)


class Passage(models.Model):
    """Describes a passage."""
    start_verse = VerseField()
    end_verse = VerseField()

    def __init__(self, *args, **kwargs):
        super(Passage, self).__init__(*args, **kwargs)
        self.entry = None

    def __eq__(self, other):
        if not isinstance(other, Passage):
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
            passages.append(Passage(start_verse=start_verse, end_verse=end_verse))

        return passages

    class Meta:
        abstract = True


class TaskPassage(Passage):
    """Describes a passage that is associated with a task."""
    task = models.ForeignKey(Task)

    @staticmethod
    def extract_from_string(task, value):
        """Calls Passage.extract_from_string and puts the results into TaskPassage objects."""
        passages = Passage.extract_from_string(value)
        task_passages = []
        for passage in passages:
            task_passage = TaskPassage(task=task, start_verse=passage.start_verse,
                                       end_verse=passage.end_verse)
            task_passages.append(task_passage)

        return task_passages


class BookPassage(Passage):
    """Describes a passage that is associated with a book."""
    book = models.ForeignKey(Book)

    @staticmethod
    def extract_from_string(book, value):
        """Calls Passage.extract_from_string and puts the results into BookPassage objects."""
        passages = Passage.extract_from_string(value)
        book_passages = []
        for passage in passages:
            book_passage = BookPassage(book=book, start_verse=passage.start_verse,
                                       end_verse=passage.end_verse)
            book_passages.append(book_passage)

        return book_passages


class TaskAsset(models.Model):
    """Describes an asset that is associated with a task."""
    task = models.ForeignKey(Task)
    asset = models.ForeignKey(Asset, on_delete=models.PROTECT)


class Instructor(models.Model):
    """Describes an instructor of a course."""
    course = models.ManyToManyField(Course, blank=True)
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255)
    biography = models.TextField(blank=True)
    profile_image = models.ImageField(upload_to='profile_images/instructors')

    def __unicode__(self):
        return self.name
