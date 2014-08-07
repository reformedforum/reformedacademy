from django.conf.urls import patterns, include, url
from tastypie.api import Api
from media.api import StatResource, AssetResource

from django.contrib import admin
admin.autodiscover()

v1_api = Api(api_name='v1')
v1_api.register(StatResource())
v1_api.register(AssetResource())

urlpatterns = patterns('',
    # Examples:
    url(r'^$', 'reformedacademy.views.index', name='index'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^assets/download/(?P<method>[-% \w]+)/(?P<type>[-% \w]+)/(?P<asset>[-% \w]+)',
        'media.views.download', name='download_asset'),
    url(r'^admin/', include(admin.site.urls)),
    (r'^api/', include(v1_api.urls)),
)
