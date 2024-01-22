from django.contrib.auth import get_user_model
from django.urls import reverse, reverse_lazy
from rest_framework.test import APITestCase

from movie.models import Comment, Movie, Subtitle

User = get_user_model()


class MovieAPITestCase(APITestCase):

    @classmethod
    def setUpTestData(cls):

        cls.user = User.objects.create_user(username="RottenTomatoes", password="secret")

        cls.movie = Movie.objects.create(
            name="The Dark Knight",
            synopsis="Batman faces the Joker, a criminal mastermind with a twisted sense of humor.",
            thumbnail_cover="dark_knight.jpg",
            production_year=2008,
            duration="2h32m",
            imdb_rating=9.0,
            peer=9,
            casting=["Christian Bale", "Heath Ledger", "Aaron Eckhart"]
        )

        Movie.objects.create(
            name="Inception",
            synopsis="A thief who enters the dreams of others to steal their secrets.",
            thumbnail_cover="inception.jpg",
            production_year=2010,
            duration="2h28m",
            imdb_rating=8.8,
            peer=10,
            casting=["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Ellen Page"]
        )

        cls.subtitle = Subtitle.objects.create(
            location="subtitles/the_dark_knight_english.srt",
            language="EN",
            movie=cls.movie
        )

        Subtitle.objects.create(
            location="subtitles/the_dark_knight_french.srt",
            language="fr",
            movie=cls.movie
        )

        cls.comment = Comment.objects.create(
            author=cls.user,
            movie=cls.movie,
            content="This is a great movie !",
        )

        cls.comment = Comment.objects.create(
            author=cls.user,
            movie=cls.movie,
            content="I love it !",
        )

    def format_datetime(self, datetime):
        return datetime.isoformat().replace("+00:00", "Z")


class TestMovie(MovieAPITestCase):
    url = reverse_lazy('movies-list')

    def test_list(self):

        response = self.client.get(self.url)
        movie1 = Movie.objects.first()
        movie2 = Movie.objects.last()
        expected = {
            "count": 2,
            "next": None,
            "previous": None,
            "results": [
                {'id': movie1.id, 'name': movie1.name},
                {'id': movie2.id, 'name': movie2.name},
            ]
        }
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), expected)

    def test_detail(self):

        movie = Movie.objects.last()
        response = self.client.get(reverse('movies-detail', args=[movie.id]), format="json")
        expected = {
            "id": movie.id,
            "name": movie.name,
            "imdb_rating": movie.imdb_rating,
            "production_year": movie.production_year,
            "duration": "02:28:00",
            "comments_number": 0,
            "available_subtitles": []
        }
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), expected)

    def test_movie_comments(self):
        response = self.client.get(reverse('movies-comments', args=[self.movie.id]))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 2)
        self.assertIn("This is a great movie !", response.data[0]['content'])
        self.assertIn("I love it !", response.data[1]['content'])


class TestComment(MovieAPITestCase):

    def test_list(self):
        response = self.client.get(reverse("comments-list"))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['count'], 2)
        self.assertIn(self.comment.content, response.json()['results'][1]['content'])
        self.assertIn(self.comment.author.username, response.json()['results'][1]['author'])
        self.assertIn(self.format_datetime(self.comment.created_at), response.json()['results'][1]['created_at'])

    def test_detail(self):
        response = self.client.get(reverse("comments-detail", args=[self.comment.id]))
        expected = {
            "author": self.comment.author.username,
            "id": self.comment.id,
            "created_at": self.format_datetime(self.comment.created_at),
            "content": self.comment.content
        }
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), expected)
