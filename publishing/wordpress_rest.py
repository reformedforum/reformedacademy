import requests
import json
import decimal


class Post:

    def __init__(self, title, author, show, album, track, publisher, year, comment):
        self.title = title
        self.author = author
        self.show = show
        self.album = album
        self.track = track
        self.publisher = publisher
        self.year = year
        self.comment = comment

    def __str__(self):
        return '{} - {}'.format(self.title, self.author)


class WordpressREST:

    def __init__(self, base_url, username, password):
        self.base_url = base_url
        self.username = username
        self.password = password

    def get_post(self, slug):
        url = '{}/posts?slug={}&_embed=true'.format(self.base_url, slug)
        r = requests.get(url, auth=(self.username, self.password))
        post = r.json()
        track_title = post[0]['title']['rendered']
        artist_name = 'Reformed Form' # '','.join([author["name"] for author in post[0]['_embedded']['author']])
        show_title, track = self.get_show_title_and_track(slug)
        album_title = show_title
        track_number = track
        year = '2016'
        comments = "These are some comments."
        publisher = 'Reformed Forum'
        return Post(title=track_title, author=artist_name, show=show_title, album=album_title, track=track_number,
                    year=year, publisher=publisher, comment=comments)

    def get_show_title_and_track(self, slug):
        if slug.startswith('ctc'):
            return 'Christ the Center', slug[3:]

        return None
