from django.contrib.auth import get_user_model
from django.core.management import BaseCommand

from movie.models import Comment, Movie, Subtitle, WatchedMovie

UserModel = get_user_model()

MOVIES = [
    {
        "name": "Inception",
        "thumbnail_cover": "inception.jpg",
        "production_year": 2010,
        "duration": 148,
        "imdb_rating": 8.8,
        "peer": 15,
        "available_subtitles": [
            {
                "location": "subtitles/inception_english.srt",
                "language": "EN",
            },
            {
                "location": "subtitles/inception_spanish.srt",
                "language": "SP",
            },
        ],
        "comments": [
            {
                "content": "Mind-bending plot and incredible visuals. A true masterpiece!"
            },
            {
                "content": "Leonardo DiCaprio's performance was exceptional. Loved every minute!"
            },
            {
                "content": "The concept of dreams within dreams was mind-blowing. Nolan at his best!"
            },
        ],
    },
    {
        "name": "The Dark Knight",
        "thumbnail_cover": "dark_knight.jpg",
        "production_year": 2008,
        "duration": 152,
        "imdb_rating": 9.0,
        "peer": 20,
        "available_subtitles": [
            {
                "location": "subtitles/the_dark_knight_english.srt",
                "language": "EN",
            },
            {
                "location": "subtitles/the_dark_knight_french.srt",
                "language": "FR",
            },
        ],
        "comments": [
            {"content": "Heath Ledger's Joker is iconic. Chilling performance!"},
            {"content": "Christian Bale nailed it as Batman. Dark and intense."},
            {"content": "The plot twists and turns kept me on the edge of my seat."},
        ],
    },
    {
        "name": "Pulp Fiction",
        "thumbnail_cover": "pulp_fiction.jpg",
        "production_year": 1994,
        "duration": 154,
        "imdb_rating": 8.9,
        "peer": 18,
        "available_subtitles": [],
        "comments": [
            {"content": "Tarantino's storytelling is unmatched. A cult classic!"},
            {
                "content": "The dialogue, the characters, the music – a film like no other."
            },
            {"content": "Samuel L. Jackson's Ezekiel 25:17 speech is legendary."},
        ],
    },
    {
        "name": "The Shawshank Redemption",
        "thumbnail_cover": "shawshank_redemption.jpg",
        "production_year": 1994,
        "duration": 142,
        "imdb_rating": 9.3,
        "peer": 12,
        "available_subtitles": [
            {
                "location": "subtitles/shawshank_redemption_english.srt",
                "language": "EN",
            },
            {
                "location": "subtitles/shawshank_redemption_french.srt",
                "language": "FR",
            },
        ],
        "comments": [
            {"content": "A tale of hope and redemption. Tim Robbins was phenomenal."},
            {"content": "Morgan Freeman's narration adds so much depth to the story."},
            {"content": "One of those movies that stays with you long after it ends"},
        ],
    },
    {
        "name": "Forrest Gump",
        "thumbnail_cover": "forrest_gump.jpg",
        "production_year": 1994,
        "duration": 142,
        "imdb_rating": 8.8,
        "peer": 14,
        "available_subtitles": [
            {
                "location": "subtitles/forrest_gump_english.srt",
                "language": "EN",
                "movie_id": 4,
            },
            {
                "location": "subtitles/forrest_gump_spanish.srt",
                "language": "SP",
                "movie_id": 4,
            },
        ],
        "comments": [],
    },
]


class Command(BaseCommand):
    help = "Initialize project for local development"

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.MIGRATE_HEADING(self.help))

        Comment.objects.all().delete()
        Subtitle.objects.all().delete()
        Movie.objects.all().delete()

        adm_user = UserModel.objects.filter(username="admin").first()
        for movie_data in MOVIES:
            movie = Movie.objects.create(
                name=movie_data["name"],
                thumbnail_cover=movie_data["thumbnail_cover"],
                production_year=movie_data["production_year"],
                duration=movie_data["duration"],
                imdb_rating=movie_data["imdb_rating"],
            )
            for available_subtitles_data in movie_data["available_subtitles"]:
                Subtitle.objects.create(
                    location=available_subtitles_data["location"],
                    language=available_subtitles_data["language"],
                    movie=movie,
                )

            for comment in movie_data["comments"]:
                Comment.objects.create(
                    author=adm_user, movie=movie, content=comment["content"]
                )

            WatchedMovie.objects.create(watcher=adm_user, movie=movie)

        self.stdout.write(self.style.SUCCESS("All done !"))
