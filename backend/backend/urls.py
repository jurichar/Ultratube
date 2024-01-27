"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from movie.views import CommentViewSet, FavouriteListCreateDeleteViewSet, MovieViewSet
from rest_framework import routers
from django.contrib import admin
from django.urls import include, path

admin.autodiscover()


router = routers.SimpleRouter()

router.register("movies", MovieViewSet, basename="movies")
router.register("comments", CommentViewSet, basename="comments")
router.register(
    "favourite-movies", FavouriteListCreateDeleteViewSet, basename="favourite-movies"
)


urlpatterns = [
    path("admin/", admin.site.urls),
    path("oauth/", include("authentication.urls")),
    path("o/", include("oauth2_provider.urls", namespace="oauth2_provider")),
    path("api/", include(router.urls)),
]
