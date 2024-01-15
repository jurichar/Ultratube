from django.contrib.auth import get_user_model
from django.contrib.postgres.fields import ArrayField
from django.db import models


class Movie(models.Model):
    name = models.CharField(max_length=128, unique=True)
    synopsis = models.TextField(null=True)
    thumbnail_cover = models.CharField(max_length=255)
    production_year = models.IntegerField(null=True)
    duration = models.DurationField()
    genre = models.CharField(max_length=255)
    imdb_rating = models.FloatField(null=True)
    peer = models.IntegerField()  # to sort movies can also be downloaded or seeders
    subtitles = ArrayField(
        models.CharField(max_length=255, null=True)
    )
    casting = ArrayField(
        models.CharField(max_length=64)
    )


class WatchedMovie(models.Model):
    watcher = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
    favourite = models.BooleanField(default=False)
    watched_at = models.DateTimeField(auto_now_add=True)


class Comment(models.Model):
    author = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
