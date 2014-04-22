"""rfmedia/api.py

"""

from tastypie.resources import ModelResource
from rfmedia.models import Stat


class StatResource(ModelResource):
    class Meta:
        queryset = Stat.objects.all()
        resource_name = 'stat'
