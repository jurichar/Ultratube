from django.urls import path, include

from . import views

urlpatterns = [
    path("token/", views.index , name='token-generator'),
]
