import re
from . import data

# regular expressions for matching a valid normalized verse string
verse_re = re.compile(r'^\d{1,2}-\d{1,3}-\d{1,3}(-[a-zA-Z]{2,})?$')

# regular expressions for identifying book, and chapter:verse references
book_re = re.compile(r'^\d*[a-zA-Z ]*')
ref_re = re.compile(r'\d{1,3}:\d{1,3}')
translation_re = re.compile(r'[a-zA-Z]{2,}$')

class RangeError(Exception):
    """Exception class for books, verses, and chapters out of range"""
    pass

class Verse(object):
    """Class to represent a Bible reference (book, chapter, and verse)"""

    def __init__(self, *args):
        """Create a new Verse object - accepts several different inputs:

        Examples: book = 46
                  chapter = 2
                  verse = 1
                  Verse(book, chapter, verse)

                  hash = 46002001
                  Verse(hash)

                  normalized_string = '46-2-1'
                  Verse(normalized_string)

                  unformatted_string = '1 Cor 12:1'
                  unformatted_string = '1cor12:1'
                  unformatted_string = '1c 12:1'
                  Verse(unformatted_string)"""

        # Initialize all properties first
        self.book = 0
        self.chapter = 0
        self.verse = 0
        self.translation = None

        # If we received one integer, convert to string and parse
        if len(args) == 1 and (isinstance(args[0], long) or isinstance(args[0], int)):
            try:
                strval = str(args[0])
                # If strval length is 7, we know the leading 0 got chopped off during conversion
                if len(strval) == 7:
                    strval = '0{}'.format(strval)
                # Parse (e.g. 01001033)
                self.book = int(strval[:2])
                self.chapter = int(strval[2:5])
                self.verse = int(strval[5:])
                self.translation = None
            except:
                raise RangeError("We can't parse the number passed in: {}".format(args[0]))

        # if we got 3 or 4 values, let's assume they are book, chapter, verse, translation)
        elif len(args) >= 3:
            self.book = args[0]
            self.chapter = args[1]
            self.verse = args[2]
            if len(args) == 4:
                self.translation = args[3]

        # if we only got one value, lets try to figure it out
        elif len(args) == 1 and len(args[0]) > 0:

            # maybe we got a normalized b-c-v(-t) string
            try:
                # check to make sure we have a valid verse string
                if not verse_re.search(args[0]):
                    raise Exception('String should be in normalized b-c-v(-t) format.')

                # extract the parts from the string
                parts = args[0].split('-')
                self.book, self.chapter, self.verse = map(int, parts[:3])
                if len(parts) > 3:
                    self.translation = parts[3]

            # if not, let's try to extract the values
            except:

                # find the book reference
                try:
                    b = book_re.search(args[0]).group(0)
                except:
                    raise RangeError("We can't find that book of the Bible: %s" % (args[0]))

                # find the chapter:verse reference
                try:
                    ref = ref_re.search(args[0]).group(0)
                except:
                    raise Exception("We can't make sense of your chapter:verse reference")

                # find the translation, if provided
                try:
                    self.translation = translation_re.search(args[0]).group(0).upper()
                except:
                    pass

                # try to find the book listed as a book name or abbreviation
                self.bible = data.bible_data(self.translation)
                b = b.rstrip('.').lower().strip()
                for i, book in enumerate(self.bible):
                    if book['name'].lower() == b:
                        found = i + 1
                        break
                    else:
                        for abbr in book['abbrs']:
                            if abbr == b:
                                found = i + 1
                                break
                try:
                    self.book = found
                except:
                    raise RangeError("We can't find that book of the Bible!: " + b)

                # extract chapter and verse from ref
                self.chapter, self.verse = map(int, ref.split(':'))

        # if we didn't add the bible attribute above, add it now
        if 'bible' not in self.__dict__:
            self.bible = data.bible_data(self.translation)

        # check to see if the chapter is in range for the given book
        try:
            verse_count = self.bible[self.book - 1]['verse_counts'][self.chapter - 1]
        except:
            raise RangeError("There are not that many chapters in" + self.bible[self.book - 1]['name'])

        # check to see if the verse is in range for the given chapter
        if verse_count < self.verse:
            raise RangeError("There is no verse %s in %s %s" % (self.verse, self.bible[self.book - 1]['name'], self.chapter))

        # check to see if the specified verse is omitted
        try:
            omitted = self.verse in self.bible[self.book - 1]['omissions'][self.chapter-1]
            try:
                err = 'This verse is omitted from the %s translation.' % self.translation
            except:
                err = 'This verse is omitted from all modern translations.'
        except:
            omitted = False
        if omitted:
            raise RangeError(err)

    def __unicode__(self):
        return self.format()

    def format(self, val="B C:V"):
        """Return a formatted string to represent the verse
        Letters are substituted for verse attributes, like date formatting"""

        # create blank string to hold output
        f = ""

        # iterate over letters in val string passed in to method
        for c in val:
            f += _format_char(self, c)

        # return the formatted value
        return f.strip()

    def __eq__(self, other):
        if type(self) != type(other):
            return False

        # book, chapter, verse, and translation must be equal.
        if (self.book, self.chapter, self.verse, self.translation) == (other.book, other.chapter, other.verse, other.translation):
            return True

        return False

    def __ne__(self, other):
        return not self.__eq__(other)

    def __str__(self):
        """Casts a verse object into a normalized string
        This is especially useful for saving to a database"""

        # set the base string to book, chapter, and verse number
        v = "%s-%s-%s" % (str(self.book), str(self.chapter), str(self.verse))

        # if the translation is set, add it to the string
        if self.translation:
            return v + '-' + str(self.translation)
        else:
            return v

    def __hash__(self):
        """Hashes a verse object into an integer.

        This is especially useful for saving to a database and searching for a passage.
        """
        # Concatenate book, chapter, and verse string values then cast to int
        str = '{book:02d}{chapter:03d}{verse:03d}'.format(
            book=self.book,
            chapter=self.chapter,
            verse=self.verse
        )
        return int(str)


class Passage(object):
    """A passage of scripture with start and end verses"""

    def __init__(self, start, end):
        """Create a new Passage object - accepts Verse objects or any
        string inputs that can process into valid Verse objects

        Examples: v1 = Verse('Rom. 1:1')
                  v2 = Verse('Rom. 1:8')
                  Passage(v1, v2)

                  Passage('Rom. 1:1', 'Rom. 1:8')"""

        # if the args passed were Verse objects, add them to the Passage
        # directly, otherwise try to interpret them as strings
        if type(start) is Verse:
            self.start = start
        else:
            self.start = Verse(start)
        if type(end) is Verse:
            self.end = end
        else:
            self.end = Verse(end)

        # make sure start and end verses are in the same translation
        if self.start.translation != self.end.translation:
            raise Exception('Verse must be in the same translation to form a Passage')
        else:
            self.bible = self.start.bible

    def __unicode__(self):
        return self._smart_format()

    def __contains__(self, verse):
        """Check to see if a verse is included in a passage"""

        # check to see if the book is out of range
        if verse.book < self.start.book or verse.book > self.end.book:
            return False

        # if the verse is in the same book as the start verse
        if verse.book == self.start.book:

            # make sure the verse is not in an earlier chapter than the start verse
            if verse.chapter < self.start.chapter:
                return False

            # make sure verse is not in same chapter as start verse, but before it
            if verse.chapter == self.start.chapter and verse.verse < self.start.verse:
                return False

        # if the verse is in the same book as the end verse
        if verse.book == self.end.book:

            # make sure the verse is not in a later chapter than the end verse
            if verse.chapter > self.end.chapter:
                return False

            # make sure verse is not in same chapter as end verse, but after it
            if verse.chapter == self.end.chapter and verse.verse > self.end.verse:
                return False

        # make sure verse is not omitted
        try:
            omissions = self.bible[verse.book - 1]['omissions'][verse.chapter-1]
            if omissions and verse.verse in omissions:
                return False
        except:
            pass

        # if we haven't failed out yet, then the verse is included
        return True

    def __len__(self):
        """Count the total number of verses in the passage"""

        # start and end are in the same book
        if self.start.book == self.end.book:

            # start and end are in the same chapter of the same book
            if self.start.chapter == self.end.chapter:
                count = self._count_verses(
                    self.start.book,
                    self.start.chapter,
                    self.start.verse,
                    self.end.verse,
                )

            # start and end are in different chapters of the same book
            else:

                # get number of verses in start chapter
                count = self._count_verses(
                    self.start.book,
                    self.start.chapter,
                    start=self.start.verse,
                )

                # add number of verses in whole chapters between start and end
                for chapter in range(self.start.chapter + 1, self.end.chapter):
                    count += self._count_verses(self.start.book, chapter)

                # add the number of verses in the end chapter
                count += self._count_verses(
                    self.end.book,
                    self.end.chapter,
                    end=self.end.verse,
                )

        # start and end are in different books
        else:

            # get number of verses in first chapter of start book
            count = self._count_verses(self.start.book, self.start.chapter, start=self.start.verse)

            # add number of verses in whole chapters of start book
            for chapter in range(self.start.chapter + 1, len(self.bible[self.start.book - 1]['verse_counts']) + 1):
                count += self._count_verses(self.start.book, chapter)

            # add total number of verses in whole books between start and end
            for book in range(self.start.book + 1, self.end.book):
                for chapter in range(1, len(self.bible[book - 1]['verse_counts']) + 1):
                    count += self._count_verses(book, chapter)

            # add number of verses in whole chapters of end book
            for chapter in range(1, self.end.chapter):
                count += self._count_verses(self.end.book, chapter)

            # get the number of verses in last chapter of end book
            count += self._count_verses(self.end.book, self.end.chapter, end=self.end.verse)

        # return the count
        return count

    def __eq__(self, other):
        if type(self) != type(other):
            return False

        # start (verse), and end, must be equal.
        if (self.start, self.end) == (other.start, other.end):
            return True

        return False

    def __ne__(self, other):
        return not self.__eq__(other)

    def __str__(self):
        """Casts a passage object into a normalized string
        This would be useful for saving to a database if the __init__ for this
        class accepted the string as input - need to add that capability"""

        return str(self.start) + ' ' + str(self.end)

    def _count_verses(self, book, chapter, start=False, end=False):
        """counts the number of non-omitted verses in a singler chapter or range of
        verses from a chapter"""

        # get book data
        book = self.bible[book - 1]

        # create list with all verses to look at
        if not start:
            start = 1
        if not end:
            end = book['verse_counts'][chapter - 1]
        verses = range(start, end + 1)

        # remove omissions from list of verses
        if 'omissions' in book and len(book['omissions']) >= chapter:
            omissions = book['omissions'][chapter-1]
            for v in omissions:
                if v in verses:
                    verses.remove(v)

        # send back a count of the verses that survived
        return len(verses)

    def format(self, val=None):
        """Return a formatted string to represent the passage
        Letters are substituted for verse attributes, like date formatting
        Lowercase letters (a, b, c, and v) refer to end verse reference
        The letter P inserts the _smart_format() string for the passage"""

        # if we got a string, process it and return formatted verse
        if val:

            # create blank string to hold output
            f = ""

            # iterate over letters in val string passed in to method
            for c in val:
                if c == "P":
                    f += self._smart_format()
                elif c.isupper():
                    f += _format_char(self.start, c)
                else:
                    f += _format_char(self.end, c)

            # return formatted string
            return f.strip()

        # if we didn't get a formatting string, send back the _smart_format()
        else:
            return self._smart_format()

    def _smart_format(self):
        """Display a human-readible string for passage
        E.g. Start:  Rom. 12:1
             End:    Rom. 12:8
             Output: Romans 12:1-8
             ------
             Start:  Rom. 1:1
             End:    Rom. 2:1
             Output: Romans 1:1 - 2:1
             ------
             Start:  Acts 1:1
             End:    Rom. 1:1
             Output: Acts 1:1 - Romans 1:1"""

        # a single verse, not a true passage
        if self.start == self.end:

            # No chapters, ie: 2 John, 3 John, Jude...
            if len(self.start.bible[self.start.book-1]['verse_counts']) == 1:
                f = self.format('B V')

            f = self.format('B C:V')

        # start and end are in the same book
        elif self.start.book == self.end.book:

            # start and end are in the same chapter of the same book
            if self.start.chapter == self.end.chapter:

                # No chapters.
                if len(self.start.bible[self.start.book-1]['verse_counts']) == 1:
                    f = self.format('B V-v')
                else:
                    f = self.format('B C:V-v')

            # start and end are in different chapters of the same book
            else:
                f = self.format('B C:V - c:v')

        # start and end are in different books
        else:
            # No chapters.
            if len(self.start.bible[self.start.book-1]['verse_counts']) == 1 and len(self.end.bible[self.end.book-1]['verse_counts']) == 1:
                f = self.format('B V - b v')

             # No chapters in start.
            elif len(self.start.bible[self.start.book-1]['verse_counts']) == 1:
                f = self.format('B V - b c:v')

            # No chapters in end.
            elif len(self.end.bible[self.end.book-1]['verse_counts']) == 1:
                f = self.format('B C:V - b v')
            else:
                f = self.format('B C:V - b c:v')

        # return the formatted value
        return f


def _format_char(verse, char):
    """return a string for the part of a verse represented by a
    formatting char:

    A - Book abbreviation (e.g. "Gen", "Rom")
    B - Full book name (e.g. "Genesis", "Romans")
    C - Chapter number
    V - Verse number
    T - Translation"""

    # use uppercase letter for comparison
    c = char.upper()

    # replace vals for start verse
    if c == "B":
        return verse.bible[verse.book-1]['name']
    elif c == "A":
        return verse.bible[verse.book-1]['abbrs'][0].title()
    elif c == "C":
        return str(verse.chapter)
    elif c == "V":
        return str(verse.verse)
    elif c == "T":
        try:
            return str(verse.translation)
        except:
            return ""
    else:
        return char

