from email.policy import default
from django.contrib.auth import get_user_model
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models


class Movie(models.Model):
    name = models.CharField(max_length=128)
    imdb_rating = models.FloatField(
        validators=[MinValueValidator(0.0), MaxValueValidator(10.0)],
        null=True,
        blank=True,
    )
    thumbnail_cover = models.CharField(max_length=255)
    production_year = models.IntegerField(
        validators=[MinValueValidator(1888)], null=True, blank=True
    )
    language = models.CharField(null=False, default="en")
    quality = models.CharField(null=False, default="720p")
    duration = models.IntegerField(validators=[MinValueValidator(0)])
    torrent = models.CharField(null=False)

    def __str__(self):
        return self.name


class Subtitle(models.Model):

    location = models.CharField(max_length=255)
    language = models.CharField(max_length=5)
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE, related_name="subtitles")

    def __str__(self):
        return f"{self.language}: {self.movie.name}"


class WatchedMovie(models.Model):
    watcher = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
    watched_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.watcher.username}: {self.movie.name}"


class Comment(models.Model):

    author = models.ForeignKey(
        get_user_model(), on_delete=models.CASCADE, related_name="author"
    )
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE, related_name="movie")
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.content


class FavouriteMovie(models.Model):

    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
