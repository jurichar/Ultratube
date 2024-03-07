from django.contrib.auth import get_user_model
from django.urls import reverse, reverse_lazy
from rest_framework.test import APITestCase

from movie.models import Comment, FavouriteMovie, Movie, Subtitle

User = get_user_model()


class MovieAPITestCase(APITestCase):

    @classmethod
    def setUpTestData(cls):

        cls.user = User.objects.create_user(
            username="RottenTomatoes", password="secret"
        )

        Movie.objects.create(
            name="Return of the Jediddd",
            thumbnail_cover="path/to/thumbnail/",
            duration=100,
            production_year=1988,
            imdb_rating=1.0,
        )
        cls.movie = Movie.objects.create(
            name="Return of the Jedi",
            thumbnail_cover="path/to/thumbnail/",
            duration=100,
            production_year=1988,
            imdb_rating=1.0,
        )

        cls.subtitle = Subtitle.objects.create(
            location="subtitles/the_dark_knight_english.srt",
            language="EN",
            movie=cls.movie,
        )

        Subtitle.objects.create(
            location="subtitles/the_dark_knight_french.srt",
            language="fr",
            movie=cls.movie,
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
    url = reverse_lazy("movies-list")

    def test_list(self):

        response = self.client.get(self.url)
        movie1 = Movie.objects.first()
        movie2 = Movie.objects.last()
        expected = {
            "count": 2,
            "next": None,
            "previous": None,
            "results": [
                {"id": movie1.id, "name": movie1.name},
                {"id": movie2.id, "name": movie2.name},
            ],
        }
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), expected)

    def test_detail(self):

        movie = Movie.objects.first()

        response = self.client.get(
            reverse("movies-detail", args=[movie.id]), format="json"
        )
        expected = {
            "id": movie.id,
            "name": movie.name,
            "imdb_rating": movie.imdb_rating,
            "production_year": movie.production_year,
            "duration": 100,
            "comments_number": 0,
            "available_subtitles": [],
        }
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), expected)

    def test_movie_comments_get(self):

        response = self.client.get(reverse("movies-comments", args=[self.movie.id]))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 2)
        self.assertIn("This is a great movie !", response.data[0]["content"])
        self.assertIn("I love it !", response.data[1]["content"])

    def test_movie_comments_post(self):

        self.client.force_login(self.user)
        response_success = self.client.post(
            reverse("movies-comments", args=[self.movie.id]),
            {"movie": self.movie.id, "content": "test"},
        )
        self.assertEqual(response_success.status_code, 201)

        response_error = self.client.post(
            reverse("movies-comments", args=[self.movie.id])
        )
        self.assertEqual(response_error.status_code, 400)


class TestComment(MovieAPITestCase):

    def test_list(self):

        response = self.client.get(reverse("comments-list"))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["count"], 2)
        self.assertIn(self.comment.content, response.json()["results"][1]["content"])
        self.assertIn(
            self.comment.author.username, response.json()["results"][1]["author"]
        )
        self.assertIn(
            self.format_datetime(self.comment.created_at),
            response.json()["results"][1]["created_at"],
        )

    def test_detail(self):

        response = self.client.get(reverse("comments-detail", args=[self.comment.id]))
        expected = {
            "author": self.comment.author.username,
            "id": self.comment.id,
            "created_at": self.format_datetime(self.comment.created_at),
            "content": self.comment.content,
        }
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), expected)

    def test_delete(self):

        comment_to_delete = Comment.objects.create(
            author=self.user,
            movie=self.movie,
            content="Lorem ipsum",
        )

        self.assertEqual(Comment.objects.all().count(), 3)
        response = self.client.delete(
            reverse("comments-detail", args=[comment_to_delete.id])
        )
        self.assertEqual(response.status_code, 204)
        self.assertEqual(Comment.objects.all().count(), 2)

    def test_patch(self):

        response = self.client.patch(
            reverse("comments-detail", args=[self.comment.id]),
            {"content": "I AM UPDATED"},
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            Comment.objects.get(pk=self.comment.pk).content, "I AM UPDATED"
        )

    def test_post(self):

        self.client.force_login(self.user)
        response = self.client.post(
            reverse("comments-list"), {"movie": self.movie.id, "content": "test"}
        )
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Comment.objects.last().content, "test")


class TestFavouriteMovie(MovieAPITestCase):

    def setUp(self) -> None:

        self.client.force_login(self.user)

        self.favouriteList = []
        self.favouriteList.append(
            FavouriteMovie.objects.create(user=self.user, movie=self.movie)
        )
        self.favouriteList.append(
            FavouriteMovie.objects.create(user=self.user, movie=Movie.objects.last())
        )

    def test_list(self):

        self.client.force_login(self.user)

        response = self.client.get(reverse("favourite-movies-list"))
        response_content = response.json()["results"]

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response_content[0]["movie"]["name"], self.favouriteList[0].movie.name
        )
        self.assertEqual(
            response_content[0]["movie"]["id"], self.favouriteList[0].movie.id
        )
        self.assertEqual(
            response_content[1]["movie"]["name"], self.favouriteList[1].movie.name
        )
        self.assertEqual(
            response_content[1]["movie"]["id"], self.favouriteList[1].movie.id
        )

    def test_delete(self):

        self.assertEqual(FavouriteMovie.objects.all().count(), 2)
        response = self.client.delete(
            reverse("favourite-movies-detail", args=[self.favouriteList[0].id])
        )

        self.assertEqual(response.status_code, 204)
        self.assertEqual(FavouriteMovie.objects.all().count(), 1)

    # TODO implement creates tests
    def test_create(self):
        new_movie = Movie.objects.create(
            name="dune",
            thumbnail_cover="path/to/thumbnail/",
            duration=100,
            production_year=1988,
            imdb_rating=1.0,
        )

        response = self.client.post(
            reverse("favourite-movies-list"), {"movie": new_movie.id}
        )
        self.assertEqual(response.status_code, 201)
