"""reformedacademy views.py

Defines views for the reformedacademy app.

Created by kabucey

"""
from django.shortcuts import render, get_object_or_404, get_list_or_404, redirect
from django.contrib.auth import authenticate, login as auth_login
from django.core.urlresolvers import reverse
from django.views.generic.base import View
from django.http import HttpResponseRedirect
from django.utils import timezone
from django.forms.util import ErrorList
from django.contrib.auth.models import User
from django.contrib import messages
from reformedacademy.forms import SignUpForm, LoginForm
from django import forms
import random


class SignUpFormView(View):
    form_class = SignUpForm
    template_name = 'reformedacademy/signup.html'

    def get(self, request, *args, **kwargs):
        form = self.form_class()
        return render(request, self.template_name, {'form': form})

    def post(self, request, *args, **kwargs):
        form = self.form_class(request.POST)
        if form.is_valid():
            """Create user account. Since we use emails for authentication and django requires
            usernames, we'll create a random username."""
            choices = 'abcdefghijklmnopqrstuvwxyz0123456789'
            username = ''.join([random.choice(choices) for i in range(0,30)])
            email = form.cleaned_data.get('email')
            password = form.cleaned_data.get('password')
            user = User.objects.create_user(username=username, email=email, password=password)

            if user:
                # Send out validation email
                return HttpResponseRedirect(reverse('email_confirmation'))
            else:
                message = """Something with oddly wrong with creating your account. Try creating
                your account again, and if it continues not to work please contact support."""
                messages.error(request, message)

        return render(request, self.template_name, {'form': form})


class LoginFormView(View):
    form_class = LoginForm
    template_name = 'reformedacademy/login.html'

    def get(self, request, *args, **kwargs):
        form = self.form_class()
        return render(request, self.template_name, {'form': form})

    def post(self, request, *args, **kwargs):
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
                    message = 'You cannot login at this time becuase your account is disabled.'
                    errors.append(message)
            else:
                errors = form._errors.setdefault(forms.forms.NON_FIELD_ERRORS, ErrorList())
                errors.append('Invalid login.')

        return render(request, self.template_name, {'form': form})


def index(request):
	return render(request, 'reformedacademy/index.html')


def email_confirmation(request):
    return render(request, 'reformedacademy/email_confirmation.html')
