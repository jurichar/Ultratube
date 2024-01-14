from django.urls import path, include
from .views import AccessTokenDetail, DiscordAuthView, FortyTwoAuthView, UserList
from rest_framework.urlpatterns import format_suffix_patterns


urlpatterns = [
    path("callback/", DiscordAuthView.as_view() , name='token-generator'),
    path("42/callback/", FortyTwoAuthView.as_view() , name='token-generator-42'),
    path('user/', UserList.as_view(), name="user-list" ),
    path('update-token/<str:token>/', AccessTokenDetail.as_view(), name="token-api" )
]

urlpatterns = format_suffix_patterns(urlpatterns)