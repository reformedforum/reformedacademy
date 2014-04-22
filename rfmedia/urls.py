from django.conf.urls import patterns, include, url
# from api import StatResource

from django.contrib import admin
admin.autodiscover()

# stat_resource = StatResource()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'rfmedia.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^assets/download/(?P<method>\w+)/(?P<type>\w+)/(?P<asset>\w+)', 'rfmedia.views.download')
#     url(r'^admin/', include(admin.site.urls)),
#     (r'^api/', include(stat_resource.urls)),
)
