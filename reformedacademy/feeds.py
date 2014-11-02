import datetime

from django.contrib.syndication.views import Feed
from django.core.urlresolvers import reverse
from django.shortcuts import get_object_or_404
from django.utils.feedgenerator import Rss201rev2Feed
from reformedacademy.models import Course, Task


class CourseFeed(Feed):
    """Defines a feed for a course."""

    feed_type = Rss201rev2Feed

    def __init__(self):
        self.request = None
        self.course = None

    def get_object(self, request, slug):
        self.request = request
        self.course = get_object_or_404(Course, slug=slug)
        return self.course

    def title(self, obj):
        return obj.name

    def link(self, obj):
        return reverse('course', args=(obj.slug,))

    def description(self, obj):
        return obj.description

    def items(self, obj):
        return Task.objects.filter(lesson__course=obj).order_by('lesson__order', 'order')

    def item_link(self, item):
        return reverse('lesson', args=(self.course.slug, item.lesson.slug,))

    def item_title(self, item):
        return '{}: {}'.format(item.lesson.name, item.name)

    def item_description(self, item):
        return item.description

    def item_pubdate(self, item):
        return self.course.published + datetime.timedelta(0, item.lesson.order + item.order)

    def item_enclosure_url(self, item):
        if item.asset:
            return 'http://{}{}'.format(self.request.get_host(), item.asset.download_url)
        else:
            return None

    def item_enclosure_length(self, item):
        return item.asset.filesize

    def item_enclosure_mime_type(self, item):
        return item.asset.mime_type
