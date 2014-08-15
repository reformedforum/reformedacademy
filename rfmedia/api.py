"""
Defines api resources for the rfmedia app.

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
from tastypie.resources import ModelResource
from tastypie.authentication import ApiKeyAuthentication
from models import Stat, Asset, Type


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
