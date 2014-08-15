"""
Defines forms for the reformedacademy app.

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
from django import forms
from django.contrib.auth.models import User
from django.forms import widgets


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
