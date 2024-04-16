from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    heisenberg = "http://localhost:3000/src/assets/profiles/1.svg"
    man1 = "http://localhost:3000/src/assets/profiles/2.svg"
    woman1 = "http://localhost:3000/src/assets/profiles/3.svg"
    woman2 = "http://localhost:3000/src/assets/profiles/4.svg"
    woman3 = "http://localhost:3000/src/assets/profiles/5.svg"
    woman4 = "http://localhost:3000/src/assets/profiles/6.svg"
    bear = "http://localhost:3000/src/assets/profiles/7.svg"
    man2 = "http://localhost:3000/src/assets/profiles/8.svg"
    man3 = "http://localhost:3000/src/assets/profiles/9.svg"
    man4 = "http://localhost:3000/src/assets/profiles/10.svg"
    man5 = "http://localhost:3000/src/assets/profiles/11.svg"
    sheep = "http://localhost:3000/src/assets/profiles/12.svg"

    avatars_user = {
        (heisenberg, heisenberg),
        (man1, man1),
        (woman1, woman1),
        (woman2, woman2),
        (woman3, woman3),
        (woman4, woman4),
        (bear, bear),
        (man2, man2),
        (man3, man3),
        (man4, man4),
        (man5, man5),
        (sheep, sheep),
    }
    english = "en"
    spanish = "es"
    french = "fr"

    language_user = {
        (english, english),
        (spanish, spanish),
        (french, french),
    }
    email = models.EmailField(max_length=254, unique=True, null=True, blank=True)
    avatar = models.CharField(blank=True, choices=avatars_user)
    language = models.CharField(default="en", choices=language_user)
    omniauth = models.BooleanField(default=False)

    class Meta:
        permissions = [
            ("omniauth", "user from omniauth"),
            ("regularauth", "user from regular auth"),
        ]


class TokenEmailReset(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    token_id = models.TextField(null=False)
