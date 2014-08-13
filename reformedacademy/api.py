"""reformedacademy views.py

Defines api resources for the reformedacademy app.

Created by kabucey

"""
from tastypie.resources import ModelResource
from tastypie.authentication import ApiKeyAuthentication
from reformedacademy.models import Stat, Asset, Type


class StatResource(ModelResource):
    class Meta:
        queryset = Stat.objects.all()
        resource_name = 'stat'
        allowed_methods = ['get', 'post', 'put']
        authentication = ApiKeyAuthentication()


class AssetResource(ModelResource):
    class Meta:
        queryset = Asset.objects.all()
        resource_name = 'asset'
        allowed_methods = ['get']
        excludes = ['url']
        filtering = {
            'tag': ['exact']
        }
        authentication = ApiKeyAuthentication()

    def dehydrate(self, bundle):
        download_url = bundle.request.build_absolute_uri(bundle.obj.download_url)
        bundle.data['download_url'] = download_url
        bundle.data['type'] = bundle.obj.type.name
        return bundle
