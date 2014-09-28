"""
Defines tests for the reformedacademy app.

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
from django.test import TestCase
from reformedacademy.models import *
from rfmedia.models import *


class CourseTest(TestCase):
    def setUp(self):
        """"setup the course"""
        self.category = Category.objects.create(name="Computers")
        self.instructor1 = User.objects.create(first_name="ender", last_name="man",
                                               username="enderman")
        self.instructor2 = User.objects.create(first_name="Kohn", last_name="Sham",
                                               username="dftguys")
        self.course = Course.objects.create(category=self.category, name="Games and DFT",
                                            slug='Computers', description="Fun with computers")
        self.course.instructors.add(self.instructor1)
        self.course.instructors.add(self.instructor2)

        """Let's add some more stuff to play with later"""
        self.lesson1 = Lesson.objects.create(course=self.course, name="Minecraft")
        self.lesson2 = Lesson.objects.create(course=self.course, name="DFT")
        self.task1 = Task.objects.create(lesson=self.lesson1, name="Punch the tree")
        self.task2 = Task.objects.create(lesson=self.lesson1, name="Dig")
        self.task3 = Task.objects.create(lesson=self.lesson2, name="Compute Energy")
        self.user = User.objects.create(first_name="Steve", last_name="Notch")

    def test_verify_create(self):
        """Verify that a Course can be created and that valid database
        information is returned. """
        self.assertTrue(isinstance(self.course, Course))
        self.assertEqual(self.course.name, "Games and DFT")
        self.assertEqual(self.course.slug, 'Computers')
        self.assertEqual(self.course.description, "Fun with computers")
        self.assertEqual(self.course.category.name, "Computers")

    def test_progress_for_user_and_check_complete(self):
        """Test the progress_for_user function"""
        """Steve hasn't done jack in this course let's see his progress"""
        self.assertEqual(self.course.progress_for_user(self.user), None)
        """Now he is working"""
        TaskProgress.objects.create(user = self.user, task=self.task1)
        TaskProgress.objects.create(user = self.user, task=self.task2)
        TaskProgress.objects.create(user = self.user, task=self.task3)
        self.course.check_complete(self.user)


class UserTest(TestCase):
    def setUp(self):
        self.category1 = Category.objects.create(name="Category 1")
        self.category2 = Category.objects.create(name="Category 2")
        self.course1 = Course.objects.create(category=self.category1, name="Course 1")
        self.course2 = Course.objects.create(category=self.category2, name="Course 2")
        self.user = User.objects.create(first_name="Ernst", last_name="Ising")
#        self.user.course.add(self.course1)
#        self.user.course.add(self.course2)

    def test_verify_create(self):
        self.assertTrue(isinstance(self.user, User))
        self.assertEqual(self.user.first_name, "Ernst")
        self.assertEqual(self.user.last_name, "Ising")
#        self.assertTrue(self.course1 and self.course2 in self.user.course.all())


class TaskTest(TestCase):
    def setUp(self):
        self.category = Category.objects.create(name="Category 1")
        self.course = Course.objects.create(category=self.category, name="Course 1")
        self.description = "Lorem ipsum dolor sit amet consectetur."
        self.lesson = Lesson.objects.create(course=self.course, name="Lesson 1")
        self.book = Book.objects.create(title="What a bohr")
        self.type = Type.objects.create(name = "Type 1", created='1900-5-10')
        self.asset = Asset.objects.create(type = self.type, active=1, created='1900-5-12')
        self.task =  Task.objects.create(lesson=self.lesson, name="Task 1",
                                         description=self.description, order=0, book=self.book,
                                         asset=self.asset)

    def test_verify_create(self):
        """Verify that a Task can be created and that valid database
        information is returned. """
        self.assertTrue(isinstance(self.task, Task))
        self.assertEqual(self.task.lesson.name, "Lesson 1")
        self.assertEqual(self.task.name, "Task 1")
        self.assertEqual(self.task.description, "Lorem ipsum dolor sit amet consectetur.")
        self.assertEqual(self.task.order, 0)
        self.assertEqual(self.task.book.title, "What a bohr")
        self.assertEqual(self.task.asset.type.name, "Type 1")

#   def test_verify_create(self):
#       """Verify that a Task can be created and that valid database
#       information is returned. """
#       task = Task.objects.create(lesson=self.lesson)
#       self.assertIsNot(manufacturer.id, None)
#       self.assertEqual(manufacturer.name, name)
#       self.assertEqual(manufacturer.abbreviation, abbreviation)
#       self.assertEqual(unicode(manufacturer), abbreviation)
#
#       # Clear out abbreviation and test the unicode method again
#       manufacturer.abbreviation = ''
#       self.assertEqual(unicode(manufacturer), name)

#   def test_complete(self):
#       """Verify that a Task can be completed"""
#       self.task.complete(self.user, self.course.progress_for_user(self.user))


class TaskProgressTest(TestCase):
    def setUp(self):
        """Create required objects"""
        self.category = Category.objects.create(name="Category 1")
        self.course = Course.objects.create(category=self.category, name="Course 1")
        self.lesson = Lesson.objects.create(course=self.course, name="Lesson 1")
        self.task = Task.objects.create(lesson=self.lesson, name="Task 1")
        self.user = User.objects.create(first_name="Ernst", last_name="Ising")
        self.taskprogress = TaskProgress.objects.create(user=self.user, task=self.task)

    def test_verify_create(self):
        """Verify that a TaskProgress can be created and that valid database
        information is returned. """
        self.assertTrue(isinstance(self.taskprogress, TaskProgress))
        self.assertEqual(self.taskprogress.user.first_name, "Ernst")
        self.assertEqual(self.taskprogress.task.name, "Task 1")
        self.assertNotEqual(self.taskprogress.completed, None)


class CourseProgressTest(TestCase):
    def setUp(self):
        """Create required objects"""
        self.category = Category.objects.create(name="Category 1")
        self.course = Course.objects.create(category=self.category, name="Course 1")
        self.lesson1 = Lesson.objects.create(course=self.course, name="Minecraft 101")
        self.lesson2 = Lesson.objects.create(course=self.course, name="Minecraft 102")
        self.task1 = Task.objects.create(lesson=self.lesson1, name="Punch the tree")
        self.task2 = Task.objects.create(lesson=self.lesson1, name="Dig")
        self.task3 = Task.objects.create(lesson=self.lesson2, name="Build cabin")
        self.user = User.objects.create(first_name="ender", last_name="man")
        self.courseprogress = CourseProgress.objects.create(user=self.user, course=self.course)

    def test_verify_create(self):
        """Verify that a CourseProgress can be created and that valid database
        information is returned. """
        self.assertTrue(isinstance(self.courseprogress, CourseProgress))
        self.assertEqual(self.courseprogress.user.first_name, "ender")
        self.assertEqual(self.courseprogress.course.name, "Course 1")

    def test_calc_progress(self):
        """Make sure that Mr. enderman can complete the course"""
        self.courseprogress.calc_progress(self.user)
        self.assertEqual(self.courseprogress.percentage_complete, float(0))
        TaskProgress.objects.create(user=self.user, task=self.task1)
        self.courseprogress.calc_progress(self.user)
        taskstot=self.course.total_tasks()
        self.assertEqual(self.courseprogress.percentage_complete, round(100.0/taskstot))
        TaskProgress.objects.create(user=self.user, task=self.task3)
        self.courseprogress.calc_progress(self.user)
        self.assertEqual(self.courseprogress.percentage_complete, round(200.0/taskstot))
        TaskProgress.objects.create(user=self.user, task=self.task2)
        self.courseprogress.calc_progress(self.user)
        self.assertEqual(self.courseprogress.percentage_complete, round(300.0/taskstot))
        """Mr. enderman has completed all the tasks time to complete the course."""
        self.assertEqual(self.courseprogress.completed, None)
        self.courseprogress.complete()
        self.assertNotEqual(self.courseprogress.completed, None)


"""
    def test_task_passage_create(self):
        start_verse = Verse("Genesis 1:2")
        end_verse = Verse("Genesis 1:15")
        task_passage = TaskPassage.objects.create(task=self.task,
                                                  start_verse=start_verse,
                                                  end_verse=end_verse)

        # Get the task passage from the database to make sure it comes back properly
        task_passage = TaskPassage.objects.get(pk=task_passage.pk)
        self.assertEqual(start_verse, task_passage.start_verse)
        self.assertEqual(end_verse, task_passage.end_verse)


class PassageTest(TestCase):
    def test_passage_extract(self):
        text = "Read Genesis 1:1-10 and Luke 2:3-5"
        passages = Passage.extract_from_string(text)
        self.assertEqual(len(passages), 2)
        passage1 = passages[0]
        self.assertEqual(passage1.start_verse, Verse('Genesis 1:1'))
        self.assertEqual(passage1.end_verse, Verse('Genesis 1:10'))
        passage2 = passages[1]
        self.assertEqual(passage2.start_verse, Verse('Luke 2:3'))
        self.assertEqual(passage2.end_verse, Verse('Luke 2:5'))
"""
