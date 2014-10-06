"""
Defines beta signups middleware for the reformedacademy app.

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
from django.conf import settings
from django.core.urlresolvers import reverse, resolve
from django.shortcuts import redirect


class BetaMiddleware(object):
    """Middleware for the beta test.

    Code used from django-hunger https://github.com/joshuakarjala/django-hunger

    """
    def __init__(self):
        self.enable_beta = settings.BETA_ENABLED
        self.always_allow_views = [
            'reformedacademy.views.closed_index',
            'reformedacademy.views.beta_verify',
            'reformedacademy.views.LoginFormView',
            'reformedacademy.views.activate',
            'reformedacademy.views.account_created',
            'reformedacademy.views.beta_handle_token_form',
            'tastypie.resources.wrapper'
        ]
        self.always_allow_modules = [
            'rfmedia.views'
        ]
        self.redirect = 'closed_index'

    def process_view(self, request, view_func, view_args, view_kwargs):
        if not self.enable_beta:
            return

        whitelisted_modules = ['django.contrib.auth.views',
                               'django.contrib.admin.sites',
                               'django.views.static',
                               'django.contrib.staticfiles.views']

        short_name = view_func.__class__.__name__
        if short_name == 'function':
            short_name = view_func.__name__
        view_name = self._get_view_name(request)

        full_view_name = '%s.%s' % (view_func.__module__, short_name)

        if self.always_allow_modules:
            whitelisted_modules += self.always_allow_modules

        if '%s' % view_func.__module__ in whitelisted_modules:
            return

        if full_view_name in self.always_allow_views or view_name in self.always_allow_views:
            return

        if request.session.get('beta_token_id') and \
                        full_view_name == 'reformedacademy.views.SignUpFormView':
            return

        if request.user.is_authenticated() and \
                        full_view_name != 'reformedacademy.views.SignUpFormView':
            return

        return redirect(self.redirect)

    @staticmethod
    def _get_view_name(request):
        """Return the urlpattern name."""
        if hasattr(request, 'resolver_match'):
            # Django >= 1.5
            return request.resolver_match.view_name

        match = resolve(request.path)
        return match.url_name
