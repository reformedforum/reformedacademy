import datetime

from django.contrib.syndication.views import Feed
from django.core.urlresolvers import reverse
from django.shortcuts import get_object_or_404
from django.templatetags import static
from django.utils.feedgenerator import Rss201rev2Feed
from reformedacademy.models import Course, Task


def static_url(request, path):
    """Generates a static url based on the request and path."""
    url = static.static(path)
    if 'http' not in url:
        url = 'http://{}{}'.format(request.get_host(), url)

    return url


class RFFeed(Rss201rev2Feed):
    """Reformed Forum Feed."""
    def rss_attributes(self):
        return {'version': self._version, 'xmlns:atom': 'http://www.w3.org/2005/Atom',
                'xmlns:itunes': 'http://www.itunes.com/dtds/podcast-1.0.dtd'}

    def add_root_elements(self, handler):
        super(RFFeed, self).add_root_elements(handler)

        handler.startElement('image', {})
        handler.addQuickElement('url', self.feed['image_url'])
        handler.addQuickElement('title', self.feed['title'])
        handler.addQuickElement('link', self.feed['link'])
        handler.endElement('image')

        handler.addQuickElement('itunes:author',
                                'Reformed Academy / {}'.format(self.feed['author']))

        handler.startElement('itunes:owner', {})
        handler.addQuickElement('itunes:name', 'Reformed Academy / {}'.format(self.feed['author']))
        handler.addQuickElement('itunes:email', 'support@reformed.academy')
        handler.endElement('itunes:owner')

        handler.addQuickElement('itunes:explicit', 'no')
        handler.addQuickElement('itunes:category', None, {'text': 'Education'})

    def add_item_elements(self, handler, item):
        super(RFFeed, self).add_item_elements(handler, item)
        handler.addQuickElement('itunes:author', item['author'])


class CourseFeed(Feed):
    """Defines a feed for a course."""
    feed_type = RFFeed

    def __init__(self):
        self.request = None
        self.course = None

    def get_object(self, request, slug):
        self.request = request
        self.course = get_object_or_404(Course, slug=slug)
        return self.course

    def feed_extra_kwargs(self, obj):
        url = static_url(self.request, 'images/logo_bg.png')
        author = ', '.join([unicode(i) for i in obj.instructors.all()])
        return {'image_url': url, 'author': author}

    def item_extra_kwargs(self, item):
        return {'author': 'Reformed Academy'}

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
