from django.core.exceptions import ValidationError
from rest_framework import mixins, status
from rest_framework.decorators import action
from rest_framework.generics import get_object_or_404
from rest_framework.mixins import Response
from rest_framework.viewsets import GenericViewSet, ModelViewSet, ReadOnlyModelViewSet

from rest_framework.permissions import AllowAny

# from rest_framework.permissions import AllowAny, IsAuthenticated
# from oauth2_provider.contrib.rest_framework import (
#     OAuth2Authentication,
#     TokenHasReadWriteScope,
# )

from .models import Comment, FavouriteMovie, Movie
from .serializers import (
    CommentCreateSerializer,
    CommentUpdateSerializer,
    CommentViewSerializer,
    FavouriteMovieCreateSerializer,
    FavouriteMovieSerializer,
    MovieDetailSerializer,
    MovieListSerializer,
)


class MultipleSerializerMixin:
    detail_serializer_class = None
    update_serializer_class = None
    create_serializer_class = None

    def get_serializer_class(self):
        opt = {
            "retrieve": self.detail_serializer_class,
            "partial_update": self.update_serializer_class,
            "update": self.update_serializer_class,
            "create": self.create_serializer_class,
        }.get(self.action, super().get_serializer_class())

        return super().get_serializer_class() if not opt else opt


class MovieViewSet(MultipleSerializerMixin, ReadOnlyModelViewSet):
    permission_classes = [AllowAny]
    serializer_class = MovieListSerializer
    detail_serializer_class = MovieDetailSerializer

    def get_queryset(self):
        return Movie.objects.all()

    #  to do uncomment this to implement permissions but change test
    # def get_permissions(self):
    #     if self.action in ["create", "detail"]:
    #         self.permission_classes = [IsAuthenticated, TokenHasReadWriteScope]
    #         self.authentication_classes = [OAuth2Authentication]
    #     elif self.action in ["list", "partial_update", "destroy"]:
    #         self.permission_classes = [
    #             AllowAny,
    #         ]

    #     return super().get_permissions()

    @action(detail=True, methods=["GET", "POST"])
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


class CommentViewSet(MultipleSerializerMixin, ModelViewSet):
    http_method_names = ["get", "post", "patch", "delete"]
    permission_classes = [AllowAny]
    # to do uncomment this permission  but change test
    # authentication_classes = [OAuth2Authentication]
    # permission_classes = [IsAuthenticated, TokenHasReadWriteScope]
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
    permission_classes = [AllowAny]
    serializer_class = FavouriteMovieSerializer
    create_serializer_class = FavouriteMovieCreateSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_queryset(self):
        return FavouriteMovie.objects.filter(user=self.request.user).all()
