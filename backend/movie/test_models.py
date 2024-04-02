from django.contrib.auth import get_user_model
from django.core.validators import ValidationError
from django.test import TestCase


from .models import Comment, Movie, Subtitle, WatchedMovie


class MovieTestCase(TestCase):
    def setUp(self) -> None:
        Movie.objects.create(
            name="Return of the Jedi",
            thumbnail_cover="path/to/thumbnail/",
            duration=100,
            production_year=1988,
            imdb_rating=1.0,
        )

    def test_str(self):
        movie = Movie.objects.first()
        self.assertEqual(str(movie), movie.name)

    def test_negative_imdb_rating(self):
        movie = Movie(
            name="A New Hope",
            thumbnail_cover="path/to/thumbnail/",
            duration=100,
            production_year=1988,
            imdb_rating=-1.0,
        )

        with self.assertRaises(ValidationError):
            movie.full_clean()
            movie.save()

    def test_10_imdb_rating(self):
        movie = Movie(
            name="A New Hope",
            thumbnail_cover="path/to/thumbnail/",
            duration=100,
            production_year=1988,
            imdb_rating=11.0,
        )

        with self.assertRaises(ValidationError):
            movie.full_clean()
            movie.save()

    def test_bad_production_year(self):
        movie = Movie(
            name="A New Hope",
            thumbnail_cover="path/to/thumbnail/",
            duration=100,
            production_year=1688,
            imdb_rating=1.0,
        )

        with self.assertRaises(ValidationError):
            movie.full_clean()
            movie.save()


class SubtitleTestCase(TestCase):
    def setUp(self) -> None:
        self.movieMock = Movie.objects.create(
            name="Return of the Jedi",
            thumbnail_cover="path/to/thumbnail/",
            duration=100,
            production_year=1988,
            imdb_rating=1.0,
        )

        self.subtitle = Subtitle.objects.create(
            location="path", language="EN", movie=self.movieMock
        )

    def test_str(self):
        sub = Subtitle.objects.first()
        self.assertEqual(str(sub), f"{sub.language}: {sub.movie.name}")

    def test_movie_instance(self):
        self.assertEqual(self.movieMock, self.subtitle.movie)


class CommentTestCase(TestCase):
    def setUp(self) -> None:
        self.movie = Movie.objects.create(
            name="Return of the Jedi",
            thumbnail_cover="path/to/thumbnail/",
            duration=100,
            production_year=1988,
            imdb_rating=1.0,
        )
        self.user = get_user_model().objects.create_user(
            username="toto", password="tata"
        )

        Comment.objects.create(
            author=self.user, movie=self.movie, content="Lorem ipsum"
        )

    def test_str(self):
        comment = Comment.objects.first()
        self.assertEqual(self.movie, comment.movie)
        self.assertEqual(str(comment), comment.content)


class WatchedTestCase(TestCase):
    def setUp(self) -> None:
        self.movie = Movie.objects.create(
            name="Return of the Jedi",
            thumbnail_cover="path/to/thumbnail/",
            duration=100,
            production_year=1988,
            imdb_rating=1.0,
        )
        self.movie1 = Movie.objects.create(
            name="Returnddddd of the Jedi",
            thumbnail_cover="path/to/thumbnail/",
            duration=100,
            production_year=1988,
            imdb_rating=1.0,
        )
        self.movie2 = Movie.objects.create(
            name="Retu of the Jedi",
            thumbnail_cover="path/to/thumbnail/",
            duration=100,
            production_year=1988,
            imdb_rating=1.0,
        )
        self.user = get_user_model().objects.create_user(
            username="toto", password="tata"
        )
        WatchedMovie.objects.create(watcher=self.user, movie=self.movie)
        WatchedMovie.objects.create(watcher=self.user, movie=self.movie1)

    def test_str(self):
        watched = WatchedMovie.objects.last()
        self.assertEqual(watched.movie, self.movie1)
        self.assertEqual(watched.watcher, self.user)
