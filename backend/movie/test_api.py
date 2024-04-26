from django.contrib.auth import get_user_model
from django.urls import reverse, reverse_lazy
from rest_framework.test import APITestCase

from authentication.test_user_action import setUpAuth
from movie.models import Comment, FavouriteMovie, Movie, Subtitle

User = get_user_model()


class MovieAPITestCase(APITestCase):

    @classmethod
    def setUpTestData(cls):

        cls.user = User.objects.create(username="RottenTomatoes", password="secret")
        Movie.objects.create(
            name="Return of the Jediddd",
            thumbnail_cover="path/to/thumbnail/",
            duration=100,
            production_year=1988,
            imdb_rating=1.0,
            quality="1080p",
            language="en",
            torrent="eeeee",
            torrent_hash="dd",
            imdb_code="dd",
        )
        cls.movie = Movie.objects.create(
            name="Return of the Jedi",
            thumbnail_cover="path/to/thumbnail/",
            duration=100,
            production_year=1988,
            imdb_rating=1.0,
            quality="1080p",
            language="en",
            torrent="eeeee",
            torrent_hash="dd",
            imdb_code="dd",
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
                {
                    "id": movie1.id,
                    "name": movie1.name,
                    "language": movie1.language,
                    "quality": movie1.quality,
                },
                {
                    "id": movie2.id,
                    "name": movie2.name,
                    "language": movie2.language,
                    "quality": movie2.quality,
                },
            ],
        }
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), expected)

    def test_create(self):
        movie = {
            "name": "Return of thedd Jedi",
            "imdb_rating": 1.0,
            "production_year": 1988,
            "duration": 100,
            "thumbnail_cover": "path/to/thumbnail/",
            "quality": "1080p",
            "language": "en",
            "torrent": "eeeee",
            "torrent_hash": "dd",
            "imdb_code": "dd",
        }
        response = self.client.post(
            "http://localhost:8000/api/movies/create_movie/", movie
        )
        movieDb = Movie.objects.filter(
            name=movie["name"], duration=movie["duration"], torrent=movie["torrent"]
        ).first()
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json(), {"id": movieDb.id})

    def test_delete(self):
        access_token, client, user = setUpAuth(self)
        custom_header = {"Authorization": f"Bearer {access_token}"}
        movie = {
            "name": "Return of thedd Jedi",
            "imdb_rating": 1.0,
            "production_year": 1988,
            "duration": 100,
            "thumbnail_cover": "path/to/thumbnail/",
            "quality": "1080p",
            "language": "en",
            "torrent": "eeeee",
            "torrent_hash": "dd",
            "imdb_code": "dd",
        }
        response = self.client.post(
            "http://localhost:8000/api/movies/create_movie/", data=movie
        )
        movieDb = Movie.objects.filter(
            name=movie["name"], duration=movie["duration"], torrent=movie["torrent"]
        ).first()
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json(), {"id": movieDb.id})
        movie_db = Movie.objects.last()
        response_delete = self.client.delete(
            "http://localhost:8000/api/movies/" + str(movie_db.id) + "/",
            **custom_header,
        )
        response_detail = self.client.get(
            reverse("movies-detail", args=[movie_db.id]), format="json"
        )
        self.assertEqual(response_delete.status_code, 204)
        self.assertEqual(response_detail.status_code, 404)

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
            "quality": movie.quality,
            "language": movie.language,
            "torrent": movie.torrent,
            "torrent_hash": movie.torrent_hash,
            "imdb_code": movie.imdb_code,
            "thumbnail_cover": movie.thumbnail_cover,
            "path": "",
        }
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), expected)

    def test_movie_comments_get(self):
        access_token, client, user = setUpAuth(self)
        custom_header = {"Authorization": f"Bearer {access_token}"}
        response = self.client.get(
            reverse("movies-comments", args=[self.movie.id]),
            **custom_header,
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 2)
        self.assertIn("This is a great movie !", response.data[0]["content"])
        self.assertIn("I love it !", response.data[1]["content"])

    def test_movie_comments_post(self):
        access_token, client, user = setUpAuth(self)
        custom_header = {"Authorization": f"Bearer {access_token}"}
        response_success = self.client.post(
            reverse("movies-comments", args=[self.movie.id]),
            {"movie": self.movie.id, "content": "test"},
            **custom_header,
        )
        self.assertEqual(response_success.status_code, 201)

        response_error = self.client.post(
            reverse("movies-comments", args=[self.movie.id])
        )
        self.assertEqual(response_error.status_code, 400)


class TestComment(MovieAPITestCase):

    def test_list(self):
        access_token, client, user = setUpAuth(self)
        custom_header = {"Authorization": f"Bearer {access_token}"}
        response = self.client.get(
            reverse("comments-list"),
            **custom_header,
        )
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
        access_token, client, user = setUpAuth(self)
        custom_header = {"Authorization": f"Bearer {access_token}"}
        response = self.client.get(
            reverse("comments-detail", args=[self.comment.id]),
            **custom_header,
        )
        expected = {
            "author": self.comment.author.username,
            "id": self.comment.id,
            "created_at": self.format_datetime(self.comment.created_at),
            "content": self.comment.content,
            "author_id": self.comment.author.id,
        }
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), expected)

    def test_delete(self):
        access_token = setUpAuth(self)
        custom_header = {"Authorization": f"Bearer {access_token}"}
        comment_to_delete = Comment.objects.create(
            author=self.user,
            movie=self.movie,
            content="Lorem ipsum",
        )

        self.assertEqual(Comment.objects.all().count(), 3)
        response = self.client.delete(
            reverse("comments-detail", args=[comment_to_delete.id]),
            **custom_header,
        )
        self.assertEqual(response.status_code, 204)
        self.assertEqual(Comment.objects.all().count(), 2)

    def test_patch(self):
        access_token, client, user = setUpAuth(self)
        custom_header = {"Authorization": f"Bearer {access_token}"}
        response = self.client.patch(
            reverse("comments-detail", args=[self.comment.id]),
            {"content": "I AM UPDATED"},
            **custom_header,
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            Comment.objects.get(pk=self.comment.pk).content, "I AM UPDATED"
        )

    def test_post(self):
        access_token, client, user = setUpAuth(self)
        custom_header = {"Authorization": f"Bearer {access_token}"}
        self.client.force_login(self.user)
        response = self.client.post(
            reverse("comments-list"),
            {"movie": self.movie.id, "content": "test"},
            **custom_header,
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
        self.favouriteList = []
        access_token, client, user = setUpAuth(self)
        self.favouriteList.append(
            FavouriteMovie.objects.create(user=user, movie=self.movie)
        )
        self.favouriteList.append(
            FavouriteMovie.objects.create(user=user, movie=Movie.objects.last())
        )
        # self.client.force_login(self.user)
        custom_header = {"Authorization": f"Bearer {access_token}"}
        response = client.get(reverse("favourite-movies-list"), **custom_header)
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
        access_token, client, user = setUpAuth(self)
        custom_header = {"Authorization": f"Bearer {access_token}"}
        self.assertEqual(FavouriteMovie.objects.all().count(), 2)
        response = client.delete(
            reverse("favourite-movies-detail", args=[self.favouriteList[0].id]),
            **custom_header,
        )

        self.assertEqual(response.status_code, 204)
        self.assertEqual(FavouriteMovie.objects.all().count(), 1)

    def test_create(self):
        access_token, client, user = setUpAuth(self)
        custom_header = {"Authorization": f"Bearer {access_token}"}
        new_movie = Movie.objects.create(
            name="dune",
            thumbnail_cover="path/to/thumbnail/",
            duration=100,
            production_year=1988,
            imdb_rating=1.0,
        )

        response = self.client.post(
            reverse("favourite-movies-list"), {"movie": new_movie.id}, **custom_header
        )
        self.assertEqual(response.status_code, 201)


class TestWatchedMovie(MovieAPITestCase):
    def setUp(self):
        self.movie = Movie.objects.create(
            name="Return of ccthe Jediddd",
            thumbnail_cover="path/to/thumbnail/",
            duration=100,
            production_year=1988,
            imdb_rating=1.0,
        )
        self.movie1 = Movie.objects.create(
            name="Return of dddhjccthe Jediddd",
            thumbnail_cover="path/to/thumbnail/",
            duration=100,
            production_year=1988,
            imdb_rating=1.0,
        )
        # self.user = User.objects.create_user(username="tata", password="secret")

    def test_create(self):
        access_token, client, user = setUpAuth(self)
        custom_header = {"Authorization": f"Bearer {access_token}"}
        response = self.client.post(
            reverse("watched-movies-list"),
            {"movie": self.movie.id},
            **custom_header,
        )
        self.assertEqual(response.status_code, 201)
        self.assertEqual({"movie": self.movie.id, "watcher": user.id}, response.json())

    def test_create_already_seen(self):
        access_token, client, user = setUpAuth(self)
        custom_header = {"Authorization": f"Bearer {access_token}"}
        response = self.client.post(
            reverse("watched-movies-list"),
            {"movie": self.movie.id},
            **custom_header,
        )
        self.assertEqual(response.status_code, 201)
        self.assertEqual({"movie": self.movie.id, "watcher": user.id}, response.json())
        response1 = self.client.post(
            reverse("watched-movies-list"),
            {"movie": self.movie.id},
            **custom_header,
        )
        self.assertEqual(response1.status_code, 400)

    def test_list_watched(self):
        access_token, client, user = setUpAuth(self)
        custom_header = {"Authorization": f"Bearer {access_token}"}
        response = self.client.post(
            reverse("watched-movies-list"),
            {"movie": self.movie.id},
            **custom_header,
        )
        self.assertEqual(response.status_code, 201)
        self.assertEqual({"movie": self.movie.id, "watcher": user.id}, response.json())
        response = self.client.post(
            reverse("watched-movies-list"),
            {"movie": self.movie1.id},
            **custom_header,
        )
        self.assertEqual(response.status_code, 201)
        self.assertEqual({"movie": self.movie1.id, "watcher": user.id}, response.json())
        response = self.client.get(
            reverse("watched-movies-list"),
            **custom_header,
        )
        self.assertEqual(response.status_code, 200)
        json = response.json()
        self.assertEqual(len(json), 2)
        self.assertEqual(
            json[0]["movie"],
            {
                "name": self.movie.name,
                "id": self.movie.id,
                "imdb_rating": self.movie.imdb_rating,
                "production_year": self.movie.production_year,
                "duration": self.movie.duration,
                "thumbnail_cover": self.movie.thumbnail_cover,
                "comments_number": 0,
                "available_subtitles": [],
                "quality": self.movie.quality,
                "language": self.movie.language,
                "torrent": self.movie.torrent,
                "imdb_code": self.movie.imdb_code,
                "torrent_hash": self.movie.torrent_hash,
                "path": "",
            },
        )
        self.assertEqual(
            json[1]["movie"],
            {
                "name": self.movie1.name,
                "id": self.movie1.id,
                "imdb_rating": self.movie1.imdb_rating,
                "production_year": self.movie1.production_year,
                "duration": self.movie1.duration,
                "thumbnail_cover": self.movie1.thumbnail_cover,
                "comments_number": 0,
                "available_subtitles": [],
                "quality": self.movie1.quality,
                "language": self.movie1.language,
                "torrent": self.movie1.torrent,
                "imdb_code": self.movie1.imdb_code,
                "torrent_hash": self.movie1.torrent_hash,
                "path": "",
            },
        )

    def test_list_watched_all(self):
        access_token, _, user = setUpAuth(self)
        custom_header = {"Authorization": f"Bearer {access_token}"}
        response = self.client.post(
            reverse("watched-movies-list"),
            {"movie": self.movie.id},
            **custom_header,
        )
        self.assertEqual(response.status_code, 201)
        self.assertEqual({"movie": self.movie.id, "watcher": user.id}, response.json())
        response = self.client.post(
            reverse("watched-movies-list"),
            {"movie": self.movie1.id},
            **custom_header,
        )
        self.assertEqual(response.status_code, 201)
        self.assertEqual({"movie": self.movie1.id, "watcher": user.id}, response.json())

        response = self.client.get("http://localhost:8000/api/watched-movies/all/")
        self.assertEqual(response.status_code, 200)
        json = response.json()
        self.assertEqual(len(json), 2)
        self.assertEqual(
            json[0]["movie"],
            {
                "name": self.movie.name,
                "id": self.movie.id,
                "imdb_rating": self.movie.imdb_rating,
                "production_year": self.movie.production_year,
                "duration": self.movie.duration,
                "thumbnail_cover": self.movie.thumbnail_cover,
                "comments_number": 0,
                "available_subtitles": [],
                "quality": self.movie.quality,
                "language": self.movie.language,
                "torrent": self.movie.torrent,
                "imdb_code": self.movie.imdb_code,
                "torrent_hash": self.movie.torrent_hash,
                "path": "",
            },
        )
        self.assertEqual(
            json[1]["movie"],
            {
                "name": self.movie1.name,
                "id": self.movie1.id,
                "imdb_rating": self.movie1.imdb_rating,
                "production_year": self.movie1.production_year,
                "duration": self.movie1.duration,
                "thumbnail_cover": self.movie1.thumbnail_cover,
                "comments_number": 0,
                "available_subtitles": [],
                "quality": self.movie1.quality,
                "language": self.movie1.language,
                "torrent": self.movie1.torrent,
                "imdb_code": self.movie1.imdb_code,
                "torrent_hash": self.movie1.torrent_hash,
                "path": "",
            },
        )
