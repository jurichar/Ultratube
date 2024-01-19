from django.urls import reverse, reverse_lazy
from rest_framework.test import APIClient, APITestCase

from movie.models import Movie, Subtitle


class TestMovie(APITestCase):
    url = reverse_lazy('movie-list')
    client = APIClient()

    def setUp(self) -> None:
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

        movie = Movie.objects.create(
            name="The Dark Knight",
            synopsis="Batman faces the Joker, a criminal mastermind with a twisted sense of humor.",
            thumbnail_cover="dark_knight.jpg",
            production_year=2008,
            duration="2h32m",
            imdb_rating=9.0,
            peer=9,
            casting=["Christian Bale", "Heath Ledger", "Aaron Eckhart"]
        )

        Subtitle.objects.create(
            location="subtitles/the_dark_knight_english.srt",
            language="EN",
            movie=movie
        )

        Subtitle.objects.create(
            location="subtitles/the_dark_knight_french.srt",
            language="fr",
            movie=movie
        )

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
        movie = Movie.objects.first()
        response = self.client.get(reverse('movie-detail', args=[movie.id]), format="json")
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
