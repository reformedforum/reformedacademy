"""reformedacademy views.py

Defines views for the reformedacademy app.

Created by kabucey

"""

from django import forms
from django.shortcuts import get_object_or_404
from django.contrib.auth import authenticate, login as auth_login
from django.forms.util import ErrorList
from django.shortcuts import render
from django.core.urlresolvers import reverse
from django.template.loader import render_to_string
from django.contrib.auth.models import User
from django.contrib import messages
from django.views.generic.base import View
from django.http import HttpResponseRedirect
from django.conf import settings
from reformedacademy.models import ActivationKey
from reformedacademy.forms import SignUpForm, LoginForm
from reformedacademy.utils import send_html_mail
import uuid
import random


class SignUpFormView(View):
    """View for the sign up form."""
    form_class = SignUpForm
    template_name = 'reformedacademy/signup.html'

    def get(self, request, *args, **kwargs):
        """HTTP GET"""
        form = self.form_class()
        return render(request, self.template_name, {'form': form})

    def post(self, request, *args, **kwargs):
        """HTTP POST"""
        form = self.form_class(request.POST)
        if form.is_valid():
            """Create user account. Since we use emails for authentication and django requires
            usernames, we'll create a random username."""
            choices = 'abcdefghijklmnopqrstuvwxyz0123456789'
            username = ''.join([random.choice(choices) for i in range(0, 30)])
            email = form.cleaned_data.get('email')
            password = form.cleaned_data.get('password')
            user = User.objects.create_user(username=username, email=email, password=password)

            if user:
                # User is_active is set to True by default. Set this to false because
                # they need to activate.
                user.is_active = False
                user.save()

                # Send out activation email
                self.send_activation_email(request, user)
                return HttpResponseRedirect(reverse('account_created'))
            else:
                message = """Something went oddly wrong with creating your account. Try creating
                your account again, and if it continues not to work please contact support."""
                messages.error(request, message)

        return render(request, self.template_name, {'form': form})

    def send_activation_email(self, request, user):
        """Sends an activation email with a generated key to the user."""
        # Generate activation key
        key = uuid.uuid1().hex

        # Save key to database
        ActivationKey.objects.create(user=user, key=key)

        subject = "Reformed Academy Account Activation"
        url = request.build_absolute_uri(reverse('activate', args=(user.pk, key)))
        html = render_to_string('reformedacademy/email/activation.html', {
            'url': url
        })
        send_html_mail(subject, html, settings.FROM_EMAIL_ADDRESS, [user.email])


class LoginFormView(View):
    """View for the login form."""
    form_class = LoginForm
    template_name = 'reformedacademy/login.html'

    def get(self, request, *args, **kwargs):
        """HTTP GET"""
        form = self.form_class()
        return render(request, self.template_name, {'form': form})

    def post(self, request, *args, **kwargs):
        """HTTP POST"""
        form = self.form_class(request.POST)
        if form.is_valid():
            # Log the user in
            email = request.POST.get('email')
            password = request.POST.get('password')
            user = authenticate(username=email, password=password)
            print user
            if user is not None:
                if user.is_active:
                    auth_login(request, user)
                    return HttpResponseRedirect(reverse('index'))
                else:
                    errors = form._errors.setdefault(forms.forms.NON_FIELD_ERRORS, ErrorList())
                    message = 'You cannot login at this time because your account is disabled.'
                    errors.append(message)
            else:
                errors = form._errors.setdefault(forms.forms.NON_FIELD_ERRORS, ErrorList())
                errors.append('Invalid login.')

        return render(request, self.template_name, {'form': form})


def account_created(request):
    """Shows the account created template."""
    return render(request, 'reformedacademy/account_created.html')


def activate(request, user_id, key):
    """Activates a user account."""
    user = get_object_or_404(User, pk=user_id)
    activation_key = get_object_or_404(ActivationKey, user=user, key=key)

    # Set user to active
    user.is_active = True
    user.save()

    # Delete the activation key
    activation_key.delete()

    return render(request, 'reformedacademy/welcome.html')


def welcome(request, user_id, key):
    """Displays a welcome page for newly activated users."""
    return render(request, 'reformedacademy/welcome.html')


def index(request):
    """The home page."""
    return render(request, 'reformedacademy/index.html')


def support(request):
    """The support page."""
    return render(request, 'reformedacademy/support.html')


def page_not_found(request):
    """Custom 404 view."""
    return render(request, 'reformedacademy/404.html')
