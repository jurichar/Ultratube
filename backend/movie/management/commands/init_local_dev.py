from django.contrib.auth import get_user_model
from django.contrib.auth.models import User
from django.core.management import BaseCommand

from movie.models import Movie, Subtitle

UserModel = get_user_model()

MOVIES = [
    {
        "name": "Inception",
        "synopsis": "A thief who enters the dreams of others to steal their secrets.",
        "thumbnail_cover": "inception.jpg",
        "production_year": 2010,
        "duration": "2h28m",
        "genre": "Science Fiction",
        "imdb_rating": 8.8,
        "peer": 15,
        "casting": ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Ellen Page"],
        "available_subtitles": [
            {
                "location": "subtitles/inception_english.srt",
                "language": "EN",
            },
            {
                "location": "subtitles/inception_spanish.srt",
                "language": "SP",
            }
        ]
    },
    {
        "name": "The Dark Knight",
        "synopsis": "Batman faces the Joker, a criminal mastermind with a twisted sense of humor.",
        "thumbnail_cover": "dark_knight.jpg",
        "production_year": 2008,
        "duration": "2h32m",
        "genre": "Action",
        "imdb_rating": 9.0,
        "peer": 20,
        "casting": ["Christian Bale", "Heath Ledger", "Aaron Eckhart"],
        "available_subtitles": [
            {
                "location": "subtitles/the_dark_knight_english.srt",
                "language": "EN",
            },
            {
                "location": "subtitles/the_dark_knight_french.srt",
                "language": "FR",
            }
        ]
    },
    {
        "name": "Pulp Fiction",
        "synopsis": "Various interconnected stories of crime in Los Angeles.",
        "thumbnail_cover": "pulp_fiction.jpg",
        "production_year": 1994,
        "duration": "2h34m",
        "genre": "Crime",
        "imdb_rating": 8.9,
        "peer": 18,
        "casting": ["John Travolta", "Samuel L. Jackson", "Uma Thurman"],
        "available_subtitles": []
    },
    {
        "name": "The Shawshank Redemption",
        "synopsis": "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
        "thumbnail_cover": "shawshank_redemption.jpg",
        "production_year": 1994,
        "duration": "2h22m",
        "genre": "Drama",
        "imdb_rating": 9.3,
        "peer": 12,
        "casting": ["Tim Robbins", "Morgan Freeman"],
        "available_subtitles": [
            {
                "location": "subtitles/shawshank_redemption_english.srt",
                "language": "EN",
            },
            {
                "location": "subtitles/shawshank_redemption_french.srt",
                "language": "FR",
            },
        ]

    },
    {
        "name": "Forrest Gump",
        "synopsis": "The life journey of a man with a low IQ, witnessing and unwittingly influencing several defining historical events.",
        "thumbnail_cover": "forrest_gump.jpg",
        "production_year": 1994,
        "duration": "2h22m",
        "genre": "Drama",
        "imdb_rating": 8.8,
        "peer": 14,
        "casting": ["Tom Hanks", "Robin Wright", "Gary Sinise"],
        "available_subtitles": [
            {
                "location": "subtitles/forrest_gump_english.srt",
                "language": "EN",
                "movie_id": 4
            },
            {
                "location": "subtitles/forrest_gump_spanish.srt",
                "language": "SP",
                "movie_id": 4
            },
        ]
    }
]

ADMIN_ID = "hyperadmin"
ADMIN_PASSWORD = "hypersecret"


class Command(BaseCommand):

    help = "Initialize project for local development"

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.MIGRATE_HEADING(self.help))

        Movie.objects.all().delete()
        Subtitle.objects.all().delete()
        User.objects.all().delete()

        for movie_data in MOVIES:
            movie = Movie.objects.create(
                name=movie_data['name'],
                synopsis=movie_data['synopsis'],
                thumbnail_cover=movie_data['thumbnail_cover'],
                production_year=movie_data['production_year'],
                duration=movie_data['duration'],
                genre=movie_data['genre'],
                imdb_rating=movie_data['imdb_rating'],
                peer=movie_data['peer'],
                casting=movie_data['casting'],
            )
            for available_subtitles_data in movie_data['available_subtitles']:
                Subtitle.objects.create(
                    location=available_subtitles_data['location'],
                    language=available_subtitles_data['language'],
                    movie=movie
                )

        UserModel.objects.create_superuser(ADMIN_ID, "admin@hypertube.com", ADMIN_PASSWORD)

        self.stdout.write(self.style.SUCCESS("All done !"))
