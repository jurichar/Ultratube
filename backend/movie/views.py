from rest_framework.viewsets import ReadOnlyModelViewSet

from .models import Movie
from .serializers import MovieDetailSerializer, MovieListSerializer


class MovieViewSet(ReadOnlyModelViewSet):
    serializer_class = MovieListSerializer
    detail_serializer_class = MovieDetailSerializer

    def get_queryset(self):
        return Movie.objects.all()

    def get_serializer_class(self):
        if self.action == "retrieve":
            return self.detail_serializer_class
        return super().get_serializer_class()
