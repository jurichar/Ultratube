from rest_framework import serializers

from .models import Comment, Movie, Subtitle


class SubtitleListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subtitle
        fields = ["location", "language"]


class MovieListSerializer(serializers.ModelSerializer):

    class Meta:
        model = Movie
        fields = ["id", "name"]


class MovieDetailSerializer(serializers.ModelSerializer):
    comments_number = serializers.SerializerMethodField()
    available_subtitles = SubtitleListSerializer(many=True)

    class Meta:
        model = Movie
        fields = ["name", "id", "imdb_rating", "production_year", "duration", "comments_number", "available_subtitles"]

    def get_comments_number(self, obj):
        return Comment.objects.filter(movie=obj).count()
