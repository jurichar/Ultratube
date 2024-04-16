from django.core.exceptions import ValidationError
from rest_framework import mixins, status
from rest_framework.decorators import action
from rest_framework.generics import get_object_or_404
from rest_framework.mixins import Response

from rest_framework.viewsets import (
    GenericViewSet,
    ModelViewSet,
    ReadOnlyModelViewSet,
    ViewSet,
)


from rest_framework.permissions import AllowAny, IsAuthenticated
from oauth2_provider.contrib.rest_framework import (
    OAuth2Authentication,
    TokenHasReadWriteScope,
)

from .models import Comment, FavouriteMovie, Movie, Subtitle, WatchedMovie
from .serializers import (
    CommentCreateSerializer,
    CommentUpdateSerializer,
    CommentViewSerializer,
    FavouriteMovieCreateSerializer,
    FavouriteMovieSerializer,
    MovieCreateSerializer,
    MovieDeleteSerializer,
    MovieDetailSerializer,
    MovieListSerializer,
    SubtitleCreateSerializer,
    SubtitleDetailsSerializer,
    SubtitleListSerializer,
    WatchedMovieCreateSerializer,
    WatchedMovieListSerializer,
)


class MultipleSerializerMixin:
    detail_serializer_class = None
    update_serializer_class = None
    create_serializer_class = None
    destroy_serializer_class = None

    def get_serializer_class(self):
        opt = {
            "retrieve": self.detail_serializer_class,
            "partial_update": self.update_serializer_class,
            "update": self.update_serializer_class,
            "create": self.create_serializer_class,
            "destroy": self.destroy_serializer_class,
        }.get(self.action, super().get_serializer_class())

        return super().get_serializer_class() if not opt else opt


class MovieViewSet(MultipleSerializerMixin, ReadOnlyModelViewSet):
    permission_classes = [AllowAny]
    authentication_classes = [OAuth2Authentication]
    serializer_class = MovieListSerializer
    detail_serializer_class = MovieDetailSerializer
    destroy_serializer_class = MovieDeleteSerializer

    def get_permissions(self):
        if self.action == "destroy":
            permission_classes = [IsAuthenticated, TokenHasReadWriteScope]
        else:
            permission_classes = [AllowAny]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        return Movie.objects.all()

    @action(
        detail=True,
        methods=["GET"],
    )
    def subtitles_movie(self, request, pk=None):
        get_object_or_404(Movie, pk=pk)
        queryset = Subtitle.objects.filter(movie__pk=pk).all()
        serializer = SubtitleListSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    #  Post and GET  for comment
    @action(
        detail=True,
        methods=["GET", "POST"],
        permission_classes=[IsAuthenticated, TokenHasReadWriteScope],
        authentication_classes=[OAuth2Authentication],
    )
    def comments(self, request, pk=None):
        movie = get_object_or_404(Movie, pk=pk)
        if request.method == "GET":
            comments = Comment.objects.filter(movie=movie)
            serializer = CommentViewSerializer(comments, many=True)
            return Response(serializer.data)
        elif request.method == "POST":
            comment = Comment(
                author=request.user, movie=movie, content=request.POST.get("content")
            )
            serializer = CommentCreateSerializer(comment)
            try:
                comment.full_clean()
                comment.save()
            except ValidationError:
                return Response(serializer.data, status=status.HTTP_400_BAD_REQUEST)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

    #  Post for create movie
    @action(detail=False, methods=["POST"])
    def create_movie(self, request):
        serializer = MovieCreateSerializer(data=request.data)
        if serializer.is_valid():
            movie_db = Movie.objects.filter(
                name=serializer.validated_data["name"],
                imdb_rating=serializer.validated_data["imdb_rating"],
                quality=serializer.validated_data["quality"],
                language=serializer.validated_data["language"],
            )
            if not movie_db.exists():
                serializer.save()
                movie_db = Movie.objects.filter(
                    name=serializer.data["name"],
                    imdb_rating=serializer.data["imdb_rating"],
                    quality=serializer.data["quality"],
                    language=serializer.data["language"],
                )
                return Response(
                    {"id": movie_db.first().id}, status=status.HTTP_201_CREATED
                )
            else:
                return Response({"id": movie_db.first().id}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    #  need to be auth to do that
    def destroy(self, request, pk=None):
        movie = get_object_or_404(Movie, pk=pk)
        movie.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class CommentViewSet(MultipleSerializerMixin, ModelViewSet):
    http_method_names = ["get", "post", "patch", "delete"]
    authentication_classes = [OAuth2Authentication]
    permission_classes = [IsAuthenticated, TokenHasReadWriteScope]
    serializer_class = CommentViewSerializer
    update_serializer_class = CommentUpdateSerializer
    create_serializer_class = CommentCreateSerializer

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    def get_queryset(self):
        return Comment.objects.all()


class FavouriteListCreateDeleteViewSet(
    MultipleSerializerMixin,
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    mixins.DestroyModelMixin,
    GenericViewSet,
):
    authentication_classes = [OAuth2Authentication]
    permission_classes = [IsAuthenticated, TokenHasReadWriteScope]
    serializer_class = FavouriteMovieSerializer
    create_serializer_class = FavouriteMovieCreateSerializer

    #  need to be auth
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_queryset(self):
        return FavouriteMovie.objects.filter(user=self.request.user).all()

    def create(self, request):
        dataSerializer = {
            "user": self.request.user.id,
            "movie": request.data["movie"],
        }
        serializer = FavouriteMovieCreateSerializer(data=dataSerializer)
        if serializer.is_valid():
            check_instance = FavouriteMovie.objects.filter(
                user=self.request.user.id, movie_id=request.data["movie"]
            ).exists()
            if check_instance:
                return Response(status=status.HTTP_204_NO_CONTENT)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None):
        favouriteMovie = get_object_or_404(FavouriteMovie, pk=pk)
        favouriteMovie.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class SubtitleMovieViewSet(ModelViewSet):
    permission_classes = [AllowAny]
    serializer_class = SubtitleDetailsSerializer
    queryset = Subtitle.objects.all()

    def create(self, request):
        serializer = SubtitleCreateSerializer(data=request.data)
        if serializer.is_valid():
            check_instance = Subtitle.objects.filter(
                location=request.data["location"], movie_id=request.data["movie"]
            ).exists()
            print(check_instance)
            if check_instance:
                return Response(status=status.HTTP_204_NO_CONTENT)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class WatchedMovieViewSet(mixins.ListModelMixin, mixins.CreateModelMixin, ViewSet):
    authentication_classes = [OAuth2Authentication]
    permission_classes = [IsAuthenticated, TokenHasReadWriteScope]

    def list(self, request):
        queryset = WatchedMovie.objects.filter(watcher=request.user).all()
        serializer = WatchedMovieListSerializer(queryset, many=True)
        return Response(serializer.data)

    def create(self, request):
        dataSerializer = {
            "watcher": self.request.user.id,
            "movie": request.data["movie"],
        }
        serializer = WatchedMovieCreateSerializer(data=dataSerializer)
        if serializer.is_valid():
            queryset = WatchedMovie.objects.filter(
                watcher=request.user, movie=serializer.validated_data["movie"]
            ).exists()
            if not queryset:
                serializer.create(serializer.validated_data)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                return Response("already seen", status=status.HTTP_400_BAD_REQUEST)

        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
