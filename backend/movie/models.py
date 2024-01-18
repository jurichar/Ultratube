from django.contrib.auth import get_user_model
from django.contrib.postgres.fields import ArrayField
from django.core.validators import MinValueValidator
from django.db import models


class Movie(models.Model):
    name = models.CharField(max_length=128, unique=True)
    synopsis = models.TextField(null=True, blank=True)
    thumbnail_cover = models.CharField(max_length=255)
    production_year = models.IntegerField(validators=[MinValueValidator(1888)], null=True, blank=True)
    duration = models.DurationField()
    genre = models.CharField(max_length=255)
    imdb_rating = models.FloatField(validators=[MinValueValidator(0.0)], null=True, blank=True)
    peer = models.IntegerField(validators=[MinValueValidator(0)])  # to sort movies can also be downloaded or seeders
    casting = ArrayField(
        models.CharField(max_length=64)
    )

    def __str__(self):
        return self.name


class Subtitle(models.Model):
    location = models.CharField(max_length=255)
    language = models.CharField(max_length=5)
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.language}: {self.movie.name}"


class WatchedMovie(models.Model):
    watcher = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
    watched_at = models.DateTimeField(auto_now_add=True)


class Comment(models.Model):
    author = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.content


class FavouriteMovie(models.Model):
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
