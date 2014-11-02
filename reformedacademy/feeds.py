from django.contrib.syndication.views import Feed
from django.core.urlresolvers import reverse
from django.shortcuts import get_object_or_404
from reformedacademy.models import Course, Lesson, Task


class CourseFeed(Feed):
    """Defines a feed for a course."""

    def get_object(self, request, slug):
        return get_object_or_404(Course, slug=slug)

    def title(self, obj):
        return obj.name

    def link(self, obj):
        return reverse('course', args=(obj.slug,))

    def description(self, obj):
        return obj.description

    def items(self, obj):
        return Task.objects.filter(lesson__course=obj).order_by('lesson__order', 'order')

    def item_link(self, item):
        return reverse('lesson', args=(item.lesson.course.slug, item.lesson.slug,))

    def item_title(self, item):
        return '{}: {}'.format(item.lesson.name, item.name)

    def item_description(self, item):
        return item.description

    def item_enclosure_url(self, item):
        if item.asset:
            return item.asset.download_url
        else:
            return None

    def item_enclosure_length(self, item):
        return item.asset.filesize

    def item_enclosure_mime_type(self, item):
        return item.asset.mime_type
