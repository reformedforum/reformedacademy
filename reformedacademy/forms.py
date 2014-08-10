"""reformedacademy forms.py

Defines forms for the reformedacademy app.

Created by kabucey

"""
from django import forms
from django.contrib.auth.models import User
from django.forms import widgets
from django.core.urlresolvers import reverse


class SignUpForm(forms.Form):
    email = forms.EmailField(required=True, max_length=75)
    password = forms.CharField(widget=widgets.PasswordInput, required=True)
    password_confirmation = forms.CharField(widget=widgets.PasswordInput, required=True)


    def clean(self):
        cleaned_data = super(SignUpForm, self).clean()
        email = cleaned_data.get('email')
        password = cleaned_data.get('password')
        password_confirmation = cleaned_data.get('password_confirmation')

        # Check if email address is unique
        if User.objects.filter(email=email).exists():
            raise forms.ValidationError(
                'Email address is already in use. Do you already have an account?')

        # Check if passwords are the same
        if password != password_confirmation:
            raise forms.ValidationError('Passwords are not the same.')

        return cleaned_data


class LoginForm(forms.Form):
    email = forms.EmailField(required=True, max_length=75)
    password = forms.CharField(widget=widgets.PasswordInput, required=True)
