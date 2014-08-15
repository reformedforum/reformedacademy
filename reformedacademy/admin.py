"""
Defines admin functionality for the reformedacademy app.

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
from django.contrib import admin
from reformedacademy import models


class CategoryAdmin(admin.ModelAdmin):
    model = models.Category
    prepopulated_fields = {"slug": ("name",)}


class CourseAdmin(admin.ModelAdmin):
    model = models.Course
    prepopulated_fields = {"slug": ("name",)}


class TaskInline(admin.StackedInline):
    model = models.Task
    extra = 1
    raw_id_fields = ('asset',)


class LessonAdmin(admin.ModelAdmin):
    model = models.Lesson
    inlines = [TaskInline]
    prepopulated_fields = {"slug": ("name",)}
    list_display = ('__unicode__', 'course', 'order')
    list_filter = ('course',)
    list_editable = ('order',)
    ordering = ('course', 'order')


class InstructorAdmin(admin.ModelAdmin):
    model = models.Instructor
    prepopulated_fields = {"slug": ("name",)}


admin.site.register(models.Category, CategoryAdmin)
admin.site.register(models.Course, CourseAdmin)
admin.site.register(models.Lesson, LessonAdmin)
admin.site.register(models.Instructor, InstructorAdmin)


