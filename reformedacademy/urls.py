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
from django.conf.urls import include, url
from django.conf import settings
from django.contrib import admin
from django.views import static
from reformedacademy import views as views
from rfmedia import views as rmviews
from reformedacademy.api import BookResource
from reformedacademy.feeds import CourseFeed
from rfmedia.api import StatResource, AssetResource
from tastypie.api import Api

admin.autodiscover()

v1_api = Api(api_name='v1')
v1_api.register(StatResource())
v1_api.register(AssetResource())
v1_api.register(BookResource())

urlpatterns = [
    url(r'^$', views.index, name='index'),
    # url(r'^beta/$', 'reformedacademy.views.index', name='index'),
    # url(r'^beta/handle_token_form/$', 'reformedacademy.views.beta_handle_token_form',
    #     name='beta_handle_token_form'),
    # url(r'^beta/(?P<token>[\w-]+)/$', 'reformedacademy.views.beta_verify', name='beta_verify'),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^api/', include(v1_api.urls)),

    # Reformed Academy
    url(r'^signup/', views.SignUpFormView.as_view(), name='signup'),
    url(r'^account_created/', views.account_created, name='account_created'),
    url(r'^activate/(?P<user_id>[-% \w]+)/(?P<key>[-% \w]+)', views.activate,
        name='activate'),
    url(r'^welcome/', views.welcome, name='welcome'),
    url(r'^health/', views.health, name='health'),
    url(r'^recover_password/', views.index, name='recover_password'),
    url(r'^login/', views.LoginFormView.as_view(), name='login'),
    url(r'^logout/', views.logout, name='logout'),
    url(r'^course/enroll/(?P<course_id>\d+)/$', views.enroll, name='enroll'),
    url(r'^course/drop/(?P<course_id>\d+)/$', views.drop, name='drop'),
    url(r'^course/(?P<slug>[\w-]+)/$', views.course, name='course'),
    url(r'^course/(?P<slug>[\w-]+)/rss/$', CourseFeed(), name='course_feed'),
    url(r'^course/(?P<course_slug>[\w-]+)/(?P<lesson_slug>[\w-]+)/$',
        views.lesson, name='lesson'),
    url(r'^courses/$', views.courses, name='courses'),
    url(r'^courses/(?P<category_slug>[\w-]+)/$', views.courses,
        name='courses-category'),
    url(r'^task/complete/(?P<task_id>\d+)/$', views.complete_task,
        name='complete_task'),
    url(r'^task/uncomplete/(?P<task_id>\d+)/$', views.uncomplete_task,
        name='uncomplete_task'),
    url(r'^progress/$', views.progress, name='progress'),
    url(r'^support/', views.support, name='support'),
    url(r'^profile/', views.ProfileFormView.as_view(), name='profile'),
    url(r'^password/', views.PasswordFormView.as_view(), name='password'),

    # Media system
    url(r'^assets/download/(?P<method>[-% \w]+)/(?P<type>[-% \w]+)/(?P<asset>[-% \w]+)',
        rmviews.download, name='download_asset'),
]

if settings.DEBUG:
    # static files (images, css, javascript, etc.)
    urlpatterns += [
        url(
            r'^media/(?P<path>.*)$',
            static.serve,
            {'document_root': settings.MEDIA_ROOT}
        )
    ]

# Custom handlers
handler404 = views.page_not_found
