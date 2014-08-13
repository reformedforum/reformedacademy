"""reformedacademy admin.py

Defines admin functionality for the reformedacademy app.

Created by kabucey

"""
from django.contrib import admin
from reformedacademy import models


class CategoryAdmin(admin.ModelAdmin):
    model = models.Category
    prepopulated_fields = {"slug": ("name",)}


class CourseAdmin(admin.ModelAdmin):
    model = models.Course
    prepopulated_fields = {"slug": ("name",)}


class LessonAdmin(admin.ModelAdmin):
    model = models.Lesson
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


