"""reformedacademy/utils.py

Defines utility functions for reformedacademy.

"""
from django.core.mail import EmailMessage


def str2bool(v):
    """Converts a string to a boolean."""
    return v.lower() in ("yes", "true", "t", "1")


def send_html_mail(subject, message, sender, to_list):
    """This method won't be necessary in Django 1.7, but currently there isn't a way to
    send html email."""
    msg = EmailMessage(subject, message, sender, to_list)
    msg.content_subtype = "html"  # Main content is now text/html
    return msg.send()
