from django import forms
from django.db import models
from .models import Verse, RangeError


class VerseFormField(forms.Field):
    def clean(self, value):
        """Form field for custom validation entering verses"""

        try:
            verse = Verse(value)
        except (RangeError, Exception) as err:
            raise forms.ValidationError(err.__str__())

        # return the cleaned and processed data
        return str(verse)


class VerseField(models.Field):
    description = "A scripture reference to a specific verse"

    def __init__(self, *args, **kwargs):
        kwargs['max_length'] = 8
        super(VerseField, self).__init__(*args, **kwargs)

    def db_type(self, connection):
        return 'int(%s)' % self.max_length

    def get_prep_value(self, value):
        return hash(value)

    # def from_db_value(self, value, expression, connection, context):

    def to_python(self, value):
        if value is None or type(value) is Verse:
            return value

        try:
            return Verse(value)
        except (RangeError, Exception) as err:
            raise forms.ValidationError(err.__str__())

    def formfield(self, **kwargs):
        defaults = {'form_class': VerseFormField}
        defaults.update(kwargs)
        return super(VerseField, self).formfield(**defaults)
