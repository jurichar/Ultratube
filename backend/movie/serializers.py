from dataclasses import fields
from rest_framework import serializers

from .models import Comment, FavouriteMovie, Movie, Subtitle


class SubtitleListSerializer(serializers.ModelSerializer):

    class Meta:
        model = Subtitle
        fields = ["location", "language"]


class MovieListSerializer(serializers.ModelSerializer):

    class Meta:
        model = Movie
        fields = ["id", "name"]


class MovieCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movie
        fields = [
            "name",
            "imdb_rating",
            "production_year",
            "duration",
            "thumbnail_cover",
        ]


class MovieDeleteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movie
        fields = "__all__"


class MovieDetailSerializer(serializers.ModelSerializer):

    comments_number = serializers.SerializerMethodField()
    available_subtitles = serializers.SerializerMethodField()

    class Meta:
        model = Movie
        fields = [
            "name",
            "id",
            "imdb_rating",
            "production_year",
            "duration",
            "comments_number",
            "available_subtitles",
        ]

    def get_comments_number(self, obj):
        return Comment.objects.filter(movie=obj).count()

    def get_available_subtitles(self, obj):
        subtitles = Subtitle.objects.filter(movie=obj)
        return SubtitleListSerializer(subtitles, many=True).data


class CommentViewSerializer(serializers.ModelSerializer):

    author = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ["author", "id", "created_at", "content"]

    def get_author(self, obj):
        return obj.author.username


class CommentUpdateSerializer(serializers.ModelSerializer):

    author = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ["author", "content"]

    def get_author(self, obj):
        return obj.author.username


class CommentCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Comment
        fields = ["movie", "content"]


class FavouriteMovieSerializer(serializers.ModelSerializer):

    movie = MovieListSerializer()

    class Meta:
        model = FavouriteMovie
        fields = ["movie"]


class FavouriteMovieCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = FavouriteMovie
        fields = ["movie"]
