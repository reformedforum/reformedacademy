"""rfmedia views.py

Defines api resources for the rfmedia app.

Created by kabucey

"""
from tastypie.resources import ModelResource
from tastypie.authentication import ApiKeyAuthentication
from rfmedia.models import Stat


class StatResource(ModelResource):
    class Meta:
        queryset = Stat.objects.all()
        resource_name = 'stat'
        allowed_methods = ['get', 'post', 'put']
        authentication = ApiKeyAuthentication()
