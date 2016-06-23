from django.shortcuts import render
from django.views.generic.base import View
from django.contrib.auth.decorators import login_required, user_passes_test
from django.http import HttpResponse
from django.core.files import File
from .forms import TagMP3Form
from wordpress_rest import WordpressREST
import os
from mutagen.mp3 import MP3
from mutagen.id3 import ID3NoHeaderError
from mutagen.id3 import ID3, TIT2, TALB, TPE1, TPE2, COMM, USLT, TCOM, TCON, TDRC



class TagMP3View(View):
    """View for the sign up form."""
    form_class = TagMP3Form
    template_name = 'publishing/tagmp3.html'

    def get(self, request, *args, **kwargs):
        """HTTP GET"""
        form = self.form_class()
        return render(request, self.template_name, {'form': form})

    def post(self, request, *args, **kwargs):
        """HTTP POST"""
        form = self.form_class(request.POST, request.FILES)
        if form.is_valid():
            file = request.FILES.get('mp3File')
            return self.handle_uploaded_file(file)

        return render(request, self.template_name, {
            'form': form
        })

    def handle_uploaded_file(self, file):
        tag = os.path.splitext(file.name)[0]
        wp = WordpressREST('http://reformedforum.staging.wpengine.com/wp-json/wp/v2', 'admin', '0d9MKDDnVw4U')
        post = wp.get_post(tag)

        # write in memory file to a temp file
        filename = '/tmp/{}'.format(file.name)
        with open(filename, 'w') as destination:
            for chunk in file.chunks():
                destination.write(chunk)

        # create ID3 tag if not present
        try:
            tags = ID3(filename)
        except ID3NoHeaderError:
            print "Adding ID3 header;",
            tags = ID3()

        tags["TIT2"] = TIT2(encoding=3, text=post.title)
        tags["TALB"] = TALB(encoding=3, text=post.show)
        tags["TPE2"] = TPE2(encoding=3, text=post.author)
        tags["COMM"] = COMM(encoding=3, lang=u'eng', desc='desc', text=post.comment)
        tags["TPE1"] = TPE1(encoding=3, text=post.author)
        # tags["TCOM"] = TCOM(encoding=3, text=u'mutagen Composer')
        # tags["TCON"] = TCON(encoding=3, text=u'mutagen Genre')
        tags["TDRC"] = TDRC(encoding=3, text=post.year)
        tags["TRCK"] = COMM(encoding=3, text=post.track)

        tags.save(filename)

        with open(filename, 'r') as new_file:
            response = HttpResponse(new_file, content_type='audio/mpeg')
            response['Content-Disposition'] = 'attachment; filename={}.mp3'.format(tag)
            return response


@login_required
@user_passes_test(lambda u: u.is_superuser)
def index(request):
    """The home page for publishing."""
    return render(request, 'publishing/index.html')