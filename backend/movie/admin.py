from django.contrib import admin

from .models import Comment, FavouriteMovie, Movie, Subtitle, WatchedMovie

# Register your models here.
admin.site.register(Comment)
admin.site.register(FavouriteMovie)
admin.site.register(Movie)
admin.site.register(Subtitle)
admin.site.register(WatchedMovie)
