"""
Defines urls for Reformed Academy.

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
from django.conf.urls import patterns, include, url
from django.conf import settings
from django.contrib import admin
from reformedacademy.api import BookResource
from reformedacademy.feeds import CourseFeed
from reformedacademy.views import SignUpFormView, LoginFormView, ProfileFormView, PasswordFormView
from rfmedia.api import StatResource, AssetResource
from tastypie.api import Api

admin.autodiscover()

v1_api = Api(api_name='v1')
v1_api.register(StatResource())
v1_api.register(AssetResource())
v1_api.register(BookResource())

urlpatterns = patterns('',
    url(r'^$', 'reformedacademy.views.index', name='index'),
    # url(r'^beta/$', 'reformedacademy.views.index', name='index'),
    # url(r'^beta/handle_token_form/$', 'reformedacademy.views.beta_handle_token_form',
    #     name='beta_handle_token_form'),
    # url(r'^beta/(?P<token>[\w-]+)/$', 'reformedacademy.views.beta_verify', name='beta_verify'),
    url(r'^admin/', include(admin.site.urls)),
    (r'^api/', include(v1_api.urls)),

    # Reformed Academy
    url(r'^signup/', SignUpFormView.as_view(), name='signup'),
    url(r'^account_created/', 'reformedacademy.views.account_created', name='account_created'),
    url(r'^activate/(?P<user_id>[-% \w]+)/(?P<key>[-% \w]+)', 'reformedacademy.views.activate',
        name='activate'),
    url(r'^welcome/', 'reformedacademy.views.welcome', name='welcome'),
    url(r'^recover_password/', 'reformedacademy.views.index', name='recover_password'),
    url(r'^login/', LoginFormView.as_view(), name='login'),
    url(r'^logout/', 'reformedacademy.views.logout', name='logout'),
    url(r'^course/enroll/(?P<course_id>\d+)/$', 'reformedacademy.views.enroll', name='enroll'),
    url(r'^course/drop/(?P<course_id>\d+)/$', 'reformedacademy.views.drop', name='drop'),
    url(r'^course/(?P<slug>[\w-]+)/$', 'reformedacademy.views.course', name='course'),
    url(r'^course/(?P<slug>[\w-]+)/rss/$', CourseFeed(), name='course_feed'),
    url(r'^course/(?P<course_slug>[\w-]+)/(?P<lesson_slug>[\w-]+)/$',
        'reformedacademy.views.lesson', name='lesson'),
    url(r'^courses/$', 'reformedacademy.views.courses', name='courses'),
    url(r'^courses/(?P<category_slug>[\w-]+)/$', 'reformedacademy.views.courses',
        name='courses-category'),
    url(r'^task/complete/(?P<task_id>\d+)/$', 'reformedacademy.views.complete_task',
        name='complete_task'),
    url(r'^task/uncomplete/(?P<task_id>\d+)/$', 'reformedacademy.views.uncomplete_task',
        name='uncomplete_task'),
    url(r'^progress/$', 'reformedacademy.views.progress', name='progress'),
    url(r'^support/', 'reformedacademy.views.support', name='support'),
    url(r'^profile/', ProfileFormView.as_view(), name='profile'),
    url(r'^password/', PasswordFormView.as_view(), name='password'),

    # Media system
    url(r'^assets/download/(?P<method>[-% \w]+)/(?P<type>[-% \w]+)/(?P<asset>[-% \w]+)',
        'rfmedia.views.download', name='download_asset'),
)

if settings.DEBUG:
    # static files (images, css, javascript, etc.)
    urlpatterns += patterns(
        '',
        url(
            r'^media/(?P<path>.*)$',
            'django.views.static.serve',
            {'document_root': settings.MEDIA_ROOT}
        )
    )

# Custom handlers
handler404 = 'reformedacademy.views.page_not_found'
