import datetime

from django.contrib.auth import get_user_model
from django.core.validators import ValidationError
from django.test import TestCase

from .models import Comment, Movie, Subtitle


class MovieTestCase(TestCase):
    def setUp(self) -> None:
        Movie.objects.create(
            name="Return of the Jedi",
            thumbnail_cover="path/to/thumbnail/",
            duration=datetime.timedelta(days=20, hours=10),
            genre="epic space opera",
            peer=0,
            casting=["Georges Lucas", "Mark Hamill"],
        )

    def test_str(self):
        movie = Movie.objects.first()
        self.assertEqual(str(movie), movie.name)

    def test_negative_imdb_rating(self):
        movie = Movie(
            name="A New Hope",
            thumbnail_cover="path/to/thumbnail/",
            duration=datetime.timedelta(days=20, hours=10),
            genre="epic space opera",
            peer=0,
            casting=["Georges Lucas", "Mark Hamill"],
            imdb_rating=-42.0,
        )

        with self.assertRaises(ValidationError):
            movie.full_clean()
            movie.save()

    def test_negative_peer(self):
        movie = Movie(
            name="A New Hope",
            thumbnail_cover="path/to/thumbnail/",
            duration=datetime.timedelta(days=20, hours=10),
            genre="epic space opera",
            casting=["Georges Lucas", "Mark Hamill"],
            peer=-42,
        )

        with self.assertRaises(ValidationError):
            movie.full_clean()
            movie.save()

    def test_bad_production_year(self):
        movie = Movie(
            name="A New Hope",
            thumbnail_cover="path/to/thumbnail/",
            duration=datetime.timedelta(days=20, hours=10),
            genre="epic space opera",
            casting=["Georges Lucas", "Mark Hamill"],
            peer=0,
            production_year=1777
        )

        with self.assertRaises(ValidationError):
            movie.full_clean()
            movie.save()

    def test_create_movie_with_minimum_info(self):
        movie = Movie(
            name="A New Hope",
            thumbnail_cover="path/to/thumbnail/",
            duration=datetime.timedelta(days=20, hours=10),
            genre="epic space opera",
            casting=["Georges Lucas", "Mark Hamill"],
            peer=0,
        )
        movies_count_before_create = Movie.objects.all().count()
        movie.full_clean()
        movie.save()
        self.assertEqual(movies_count_before_create + 1, Movie.objects.all().count())

    def test_create_movie_with_full_infos(self):
        movie = Movie(
            name="A New Hope",
            thumbnail_cover="path/to/thumbnail/",
            duration=datetime.timedelta(days=20, hours=10),
            genre="epic space opera",
            casting=["Georges Lucas", "Mark Hamill"],
            peer=0,
            synopsis="Lorem ipsum",
            production_year=1977,
            imdb_rating=9.3
        )
        movies_count_before_create = Movie.objects.all().count()
        movie.full_clean()
        movie.save()
        self.assertEqual(movies_count_before_create + 1, Movie.objects.all().count())


class SubtitleTestCase(TestCase):
    def setUp(self) -> None:
        Movie.objects.create(
            name="Return of the Jedi",
            thumbnail_cover="path/to/thumbnail/",
            duration=datetime.timedelta(days=20, hours=10),
            genre="epic space opera",
            peer=0,
            casting=["Georges Lucas", "Mark Hamill"],
        )

        Subtitle.objects.create(location="path", language="EN", movie=Movie.objects.get(name="Return of the Jedi"))

    def test_str(self):
        sub = Subtitle.objects.first()
        self.assertEqual(str(sub), f"{sub.language}: {sub.movie.name}")


class CommentTestCase(TestCase):
    def setUp(self) -> None:
        movie = Movie.objects.create(
            name="Return of the Jedi",
            thumbnail_cover="path/to/thumbnail/",
            duration=datetime.timedelta(days=20, hours=10),
            genre="epic space opera",
            peer=0,
            casting=["Georges Lucas", "Mark Hamill"],
        )
        user = get_user_model().objects.create_user(username="toto", password="tata")

        Comment.objects.create(author=user, movie=movie, content="Lorem ipsum")

    def test_str(self):
        comment = Comment.objects.first()
        self.assertEqual(str(comment), comment.content)
