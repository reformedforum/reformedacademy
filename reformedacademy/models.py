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
from urlparse import urlparse
import math

from bible.djangoforms import VerseField
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
from reformedacademy import utils
from rfmedia.models import Asset
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

    def progress_for_user(self, user):
        """Gets the progress for this course for user."""
        if user.is_authenticated():
            return self.courseprogress_set.filter(user=user).first()

        return None

    def check_complete(self, user):
        """Checks if a course is complete, and if it is, marks it complete in the database."""

        # Get course progress
        course_progress = self.progress_for_user(user)

        # Get all lesson progress for this course
        lp_qs = LessonProgress.objects.filter(user=user, lesson__course=self).all()
        # Convert the queryset to a list so we can do cached operations
        lp_list = list(lp_qs)

        # Assume course complete until we reach a task that isn't complete
        course_complete = True
        for lesson in self.lesson_set.all():
            lesson_progress = utils.find_using_property(lp_list, lesson, 'lesson')
            # If lesson progress was not found, or if lesson progress completed is False,
            # the course isn't complete.
            if not lesson_progress or not lesson_progress.completed:
                course_complete = False

        if course_complete:
            course_progress.complete()

    def __unicode__(self):
        return self.name

    def __eq__(self, other):
        if isinstance(other, CourseProgress):
            return other.course.id == self.id
        elif isinstance(other, Course):
            return other.id == self.id


class User(AbstractUser):
    pass
    # def progress_for_course(self, course):
    #     """Gets the progress for a course."""
    #     return self.courseprogress_set.filter(course=course).first()


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

    def progress_for_user(self, user):
        """Gets the progress for this lesson for user."""
        if user.is_authenticated():
            return self.lessonprogress_set.filter(user=user).first()

        return None

    def check_complete(self, user):
        """Checks if a lesson is complete, and if it is, marks it complete in the database."""

        # Get lesson progress
        lesson_progress = self.progress_for_user(user)

        # Get all task progress for this lesson
        tp_qs = TaskProgress.objects.filter(user=user, task__lesson=self).all()
        # Convert the queryset to a list so we can do cached operations
        tp_list = list(tp_qs)

        # Assume lesson complete until we reach a task that isn't complete
        lesson_complete = True
        for task in self.task_set.all():
            task_progress = utils.find_using_property(tp_list, task, 'task')
            # If task progress was not found, or if task progress completed is False,
            # the lesson isn't complete.
            if not task_progress or not task_progress.completed:
                lesson_complete = False

        if lesson_complete:
            lesson_progress.complete()

        self.course.check_complete(user)

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

    def progress_for_user(self, user):
        """Gets the progress for this task for user."""
        if user.is_authenticated():
            return self.taskprogress_set.filter(user=user).first()

        return None

    def uncomplete_task(self, user):
        """Deletes TaskProgress object from database"""
        if user.is_authenticated():
            TaskProgress.objects.get(user__exact=user, task__exact=self).delete()
        return None

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


class CourseProgress(models.Model):
    user = models.ForeignKey(User)
    course = models.ForeignKey(Course)
    started = models.DateTimeField(auto_now=True)
    completed = models.DateTimeField(null=True)
    percentage_complete = models.PositiveIntegerField(max_length=3, default=0,
                                                      help_text="Always a whole number.")

    def calc_progress(self, user):
        """Calculates the percentage complete for a course and saves to percentage_complete."""

        # Get all tasks for a course
        tp_qs = TaskProgress.objects.filter(user=user, task__lesson__course=self.course).all()
        # Convert the queryset to a list so we can do cached operations
        tp_list = list(tp_qs)

        total_tasks = 0
        completed_tasks = 0
        # Loop through all lessons and tasks while keeping track of total_tasks and completed_tasks
        for lesson in self.course.lesson_set.all():
            for task in lesson.task_set.all():
                total_tasks += 1
                task_progress = utils.find_using_property(tp_list, task, 'task')
                if task_progress and task_progress.completed:
                    completed_tasks += 1

        # Calculate the percentage completed and save to the database
        self.percentage_complete = math.ceil(completed_tasks / float(total_tasks) * 100)
        self.save()

    def complete(self):
        """Marks this course as complete."""
        self.completed = timezone.now()
        self.save()

    def __unicode__(self):
        return '{user} {course}'.format(user=self.user, course=self.course)


class LessonProgress(models.Model):
    user = models.ForeignKey(User)
    lesson = models.ForeignKey(Lesson)
    started = models.DateTimeField(auto_now_add=True)
    completed = models.DateTimeField(null=True)

    def complete(self):
        """Marks this lesson as complete."""
        self.completed = timezone.now()
        self.save()


class TaskProgress(models.Model):
    user = models.ForeignKey(User)
    task = models.ForeignKey(Task)
    completed = models.DateTimeField(auto_now=True)


class CourseLog(models.Model):
    user = models.ForeignKey(User)
    title = models.CharField(max_length=255)

    COURSE = 'course'
    LESSON = 'lesson'
    TASK = 'task'
    TYPE_CHOICES = (
        (COURSE, 'Course'),
        (LESSON, 'Lesson'),
        (TASK, 'Task')
    )
    type = models.CharField(max_length=255, choices=TYPE_CHOICES)

    STARTED = 'started'
    COMPLETED = 'completed'
    DROPPED = 'dropped'
    ACTION_CHOICES = (
        (STARTED, 'Started'),
        (COMPLETED, 'Completed'),
        (DROPPED, 'Dropped')
    )
    action = models.CharField(max_length=255, choices=ACTION_CHOICES)
    date = models.DateTimeField(auto_now=True)
