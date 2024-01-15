from django.contrib import admin

from .models import Comment, Movie, WatchedMovie

# Register your models here.
admin.site.register(Comment)
admin.site.register(Movie)
admin.site.register(WatchedMovie)
