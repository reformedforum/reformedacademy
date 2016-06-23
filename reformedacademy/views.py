"""
Defines views for the reformedacademy app.

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

import uuid
import random

from django import forms
from django.core.mail import send_mail
from django.db.models import Sum, Q, Count
from django.shortcuts import get_object_or_404
from django.contrib.auth import authenticate, login as auth_login, logout as auth_logout
from django.shortcuts import render
from django.core.urlresolvers import reverse
from django.template.loader import render_to_string
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.utils import timezone
from django.views.generic.base import View
from django.http import HttpResponseRedirect, Http404
from django.conf import settings
from reformedacademy.models import ActivationKey, Course, Lesson, Category, \
    Task, LessonProgress, CourseLog, User, BetaToken
from reformedacademy.forms import SignUpForm, LoginForm, ProfileForm, PasswordForm


class LoginRequiredMixin(View):
    """Mixin used to decorate class based views with login_required."""
    @classmethod
    def as_view(cls, **initkwargs):
        view = super(LoginRequiredMixin, cls).as_view(**initkwargs)
        return login_required(view)


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

                # If the beta is enabled, mark the token as redeemed by user.
                if settings.BETA_ENABLED:
                    beta_token_id = request.session.get('beta_token_id')
                    beta_token = BetaToken.objects.get(pk=beta_token_id)
                    beta_token.redeemed_by = user
                    beta_token.redeemed = timezone.now()
                    beta_token.save()

                    # Delete the beta session variable to prevent multiple sign ups.
                    # Catch the KeyError and ignore because we don't care if it doesn't exist.
                    try:
                        del request.session['beta_token_id']
                    except KeyError:
                        pass

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
        text = render_to_string('reformedacademy/email/activation.txt', {
            'url': url
        })
        html = render_to_string('reformedacademy/email/activation.html', {
            'url': url
        })
        send_mail(subject, text, settings.FROM_EMAIL_ADDRESS, [user.email], False, None, None, None,
                  html)


class LoginFormView(View):
    """View for the login form."""
    form_class = LoginForm
    template_name = 'reformedacademy/login.html'

    def get(self, request, *args, **kwargs):
        """HTTP GET"""
        form = self.form_class()
        return render(request, self.template_name, {
            'form': form,
            'beta_enabled': settings.BETA_ENABLED
        })

    def post(self, request, *args, **kwargs):
        """HTTP POST"""
        form = self.form_class(request.POST)
        if form.is_valid():
            # Log the user in
            email = request.POST.get('email')
            password = request.POST.get('password')
            user = authenticate(username=email, password=password)
            if user is not None:
                if user.is_active:
                    auth_login(request, user)
                    request.session.set_expiry(settings.LOGGED_IN_DURATION)
                    messages.info(request, 'You are now logged in.')
                    return HttpResponseRedirect(reverse('index'))
                else:
                    form.add_error('email', 'You cannot login at this time because your account is disabled.')
            else:
                form.add_error('email', 'Invalid login.')

        return render(request, self.template_name, {
            'form': form
        })


def logout(request):
    auth_logout(request)
    messages.info(request, 'You are now logged out.')
    return HttpResponseRedirect(reverse('index'))


def account_created(request):
    """Shows the account created template."""
    return render(request, 'reformedacademy/account_created.html')


def service(request):
    """Shows the service template."""
    return render(request, 'reformedacademy/service.html')


def privacy(request):
    """Shows the privacy template."""
    return render(request, 'reformedacademy/privacy.html')


def activate(request, user_id, key):
    """Activates a user account."""
    user = get_object_or_404(User, pk=user_id)
    activation_key = get_object_or_404(ActivationKey, user=user, key=key)

    # Set user to active
    user.is_active = True
    user.save()

    # Delete the activation key
    activation_key.delete()

    """Automatically log the user in. Normally authenticate needs to be called
    before logging a user in. However, in this instance, we know they are coming
    from their email so user the ModelBackend and automatically log them in."""
    user.backend = 'django.contrib.auth.backends.ModelBackend'
    auth_login(request, user)

    return HttpResponseRedirect(reverse('welcome'))


@login_required
def welcome(request):
    """Displays a welcome page for newly activated users."""
    return render(request, 'reformedacademy/welcome.html', {
        'beta_enabled': settings.BETA_ENABLED
    })


def closed_index(request):
    """The home page during beta testing."""
    return render(request, 'reformedacademy/closed_index.html', {
        'beta_enabled': settings.BETA_ENABLED
    })


def beta_verify(request, token):
    """Beta verification view used to verify beta codes."""
    try:
        # Find an unused BetaToken
        beta_token = BetaToken.objects.get(token=token, redeemed_by__isnull=True)
        request.session['beta_token_id'] = beta_token.pk
        return HttpResponseRedirect(reverse('signup'))
    except BetaToken.DoesNotExist:
        return render(request, 'reformedacademy/beta_verify.html', {
            'token': token,
            'beta_enabled': settings.BETA_ENABLED
        })


def beta_handle_token_form(request):
    """Handles the beta token form POST request."""
    token = request.POST.get('token')
    if token:
        return HttpResponseRedirect(reverse('beta_verify', args=(token,)))
    else:
        return HttpResponseRedirect(reverse('closed_index'))


def index(request):
    """The home page."""
    courses = Course.objects.filter(published__isnull=False).prefetch_related('instructors')
    instructors = User.objects.filter(courses__isnull=False).distinct()
    if request.user.is_authenticated():
        progresses = request.user.courseprogress_set.all
    else:
        progresses = None
    return render(request, 'reformedacademy/index.html', {
        'courses': courses,
        'instructors': instructors,
        'progresses': progresses,
        'beta_enabled': settings.BETA_ENABLED
    })


def course(request, slug):
    """The course page."""
    course = get_object_or_404(Course, slug=slug)
    return render(request, 'reformedacademy/course.html',
                  {'course': course})


def lesson(request, course_slug, lesson_slug):
    """The lesson page."""
    lesson = get_object_or_404(Lesson, slug=lesson_slug, course__slug=course_slug)
    return render(request, 'reformedacademy/lesson.html', {
        'lesson': lesson
    })


def courses(request, category_slug=None):
    """Displays all available courses.

    If category_slug is define, only grab courses for that category.

    """

    # Get all categories that have at least one course that is published
    categories = Category.objects.all().filter(course__published__isnull=False)\
        .annotate(num_courses=Count('course'))\
        .filter(~Q(num_courses=0))

    if category_slug:
        # We want to throw a 404 if the supplied category doesn't exist
        if not Category.objects.filter(slug=category_slug).exists():
            raise Http404

        courses = Course.objects.filter(
            published__isnull=False,
            category__slug=category_slug
        ).prefetch_related('instructors')
    else:
        courses = Course.objects.filter(published__isnull=False).prefetch_related('instructors')

    return render(request, 'reformedacademy/courses.html', {
        'categories': categories,
        'courses': courses,
        'category_slug': category_slug
    })


@login_required
def enroll(request, course_id):
    """Enrolls a user in a course."""
    course = get_object_or_404(Course, pk=course_id)

    # Check to see if a user isn't already enrolled in the course.
    # If they are just ignore and redirect.
    progress = course.progress_for_user(request.user)
    if not progress:
        course.enroll(request.user)

    messages.info(request, 'You are now enrolled in {}!'.format(course))
    return HttpResponseRedirect(reverse('course', args=(course.slug,)))


@login_required
def drop(request, course_id):
    """Drops a user from a course."""
    course = get_object_or_404(Course, pk=course_id)
    course.drop(request.user)
    messages.info(request, 'You have dropped {}.'.format(course))
    return HttpResponseRedirect(reverse('course', args=(course.slug,)))


@login_required
def complete_task(request, task_id):
    """Completes a task."""
    task = get_object_or_404(Task, pk=task_id)

    # Check to see if a user isn't already enrolled in the course
    course_progress = task.lesson.course.progress_for_user(request.user)
    if not course_progress:
        course_progress = task.lesson.course.enroll(request.user)

    # Grab the lesson progress
    lesson_progress = task.lesson.progress_for_user(request.user)
    if not lesson_progress:
        # If the lesson progress doesn't exist, create it
        LessonProgress.objects.create(user=request.user, lesson=task.lesson)
        # Log the course was started
        CourseLog.start_lesson(request.user)

    # Check to see if a user hasn't already completed the task.
    # If they are just ignore and redirect.
    task_progress = task.progress_for_user(request.user)
    if not task_progress:
        task.complete(request.user, course_progress)

    return HttpResponseRedirect(reverse('lesson', args=(task.lesson.course.slug,
                                                        task.lesson.slug,)))


@login_required
def uncomplete_task(request, task_id):
    """Uncompletes a task."""
    task = get_object_or_404(Task, pk=task_id)
    task_progress = task.progress_for_user(request.user)
    if task_progress:
        task_progress.delete()
        # Log dropping of task
        CourseLog.drop_task(request.user)

        # Uncomplete the lesson if it has already been completed
        lesson_progress = task.lesson.progress_for_user(request.user)
        if lesson_progress and lesson_progress.completed:
            lesson_progress.completed = None
            lesson_progress.save()

        # Uncomplete the course if it has already been completed
        course_progress = task.lesson.course.progress_for_user(request.user)
        if course_progress and course_progress.completed:
            course_progress.completed = None

        course_progress.calc_progress(request.user)
        course_progress.save()

    return HttpResponseRedirect(
        reverse('lesson', args=(task.lesson.course.slug, task.lesson.slug,))
    )


@login_required
def progress(request):
    """Displays course progress for the logged in user."""

    # Get all courses for the logged in user
    courses = Course.objects.filter(courseprogress__user=request.user)
    # Separate courses into enrolled courses and completed courses
    enrolled = []
    completed = []
    for course in list(courses):
        progress = course.progress_for_user(request.user)
        if progress.completed:
            completed.append(course)
        else:
            enrolled.append(course)

    return render(request, 'reformedacademy/progress.html',
                  {'enrolled': enrolled, 'completed': completed})


class ProfileFormView(LoginRequiredMixin):
    """Provides a user a way to edit their profile."""
    form_class = ProfileForm
    template_name = 'reformedacademy/profile.html'

    def get(self, request, *args, **kwargs):
        """HTTP GET"""
        form = self.form_class()
        form.fields['email'].initial = request.user.email
        return render(request, self.template_name, {'form': form})

    def post(self, request, *args, **kwargs):
        """HTTP POST"""
        form = self.form_class(data=request.POST, user=request.user)
        if form.is_valid():
            user = request.user
            user.email = form.cleaned_data.get('email')
            user.save()
            messages.info(request, 'You profile has been saved.')
            return HttpResponseRedirect(reverse('profile'))

        return render(request, self.template_name, {'form': form})


class PasswordFormView(LoginRequiredMixin):
    """Provides a user a way to edit their profile."""
    form_class = PasswordForm
    template_name = 'reformedacademy/password.html'

    def get(self, request, *args, **kwargs):
        """HTTP GET"""
        form = self.form_class()
        return render(request, self.template_name, {'form': form})

    def post(self, request, *args, **kwargs):
        """HTTP POST"""
        form = self.form_class(data=request.POST, user=request.user)
        if form.is_valid():
            user = request.user
            user.set_password(form.cleaned_data.get('password'))
            user.save()
            messages.info(request, 'Your password has been changed.')
            return HttpResponseRedirect(reverse('profile'))

        return render(request, self.template_name, {'form': form})


def support(request):
    """The support page."""
    return render(request, 'reformedacademy/support.html')


def page_not_found(request):
    """Custom 404 view."""
    return render(request, 'reformedacademy/404.html')
