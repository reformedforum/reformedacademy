from django.conf.urls import patterns, include, url
from tastypie.api import Api
from rfmedia.api import StatResource, AssetResource
from django.contrib import admin
from reformedacademy.views import SignUpFormView, LoginFormView

admin.autodiscover()

v1_api = Api(api_name='v1')
v1_api.register(StatResource())
v1_api.register(AssetResource())

urlpatterns = patterns('',
    # Examples:
    url(r'^$', 'reformedacademy.views.index', name='index'),
    url(r'^admin/', include(admin.site.urls)),
    (r'^api/', include(v1_api.urls)),

    # Reformed Academy
    url(r'^signup/', SignUpFormView.as_view(), name='signup'),
    url(r'^email_confirmation/', 'reformedacademy.views.email_confirmation',
        name='email_confirmation'),
    url(r'^recover_password/', 'reformedacademy.views.index', name='recover_password'),
    url(r'^login/', LoginFormView.as_view(), name='login'),


    # Media system
    url(r'^assets/download/(?P<method>[-% \w]+)/(?P<type>[-% \w]+)/(?P<asset>[-% \w]+)',
        'rfmedia.views.download', name='download_asset'),
)
