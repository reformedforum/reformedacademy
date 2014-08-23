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
from bible.models import Verse

from django.test import TestCase
from reformedacademy.models import Category, Course, Lesson, Task, TaskPassage, Passage


class TaskTest(TestCase):
    def setUp(self):
        # Create required objects
        self.category = Category.objects.create(name="Category 1")
        self.course = Course.objects.create(category=self.category, name="Course 1")
        description = "Lorem ipsum dolor sit amet consectetur."
        self.lesson = Lesson.objects.create(course=self.course, name="Lesson 1")
        self.task = Task.objects.create(lesson=self.lesson)

    # def test_verify_create(self):
    #     """Verify that a Task can be created and that valid database
    #     information is returned. """
    #     task = Task.objects.create(lesson=self.lesson)
    #     self.assertIsNot(manufacturer.id, None)
    #     self.assertEqual(manufacturer.name, name)
    #     self.assertEqual(manufacturer.abbreviation, abbreviation)
    #     self.assertEqual(unicode(manufacturer), abbreviation)
    #
    #     # Clear out abbreviation and test the unicode method again
    #     manufacturer.abbreviation = ''
    #     self.assertEqual(unicode(manufacturer), name)

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

