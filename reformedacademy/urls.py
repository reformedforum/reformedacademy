from django.conf.urls import patterns, include, url
from tastypie.api import Api
from api import StatResource

from django.contrib import admin
admin.autodiscover()

v1_api = Api(api_name='v1')
v1_api.register(StatResource())

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'reformedacademy.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^assets/download/(?P<method>\w+)/(?P<type>\w+)/(?P<asset>\w+)', 'reformedacademy.views.download'),
    url(r'^admin/', include(admin.site.urls)),
    (r'^api/', include(v1_api.urls)),
)
