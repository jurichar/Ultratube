from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    heisenberg = "http://localhost:3000/src/assets/profiles/1.svg"
    man = "http://localhost:3000/src/assets/profiles/2.svg"
    man1 = "http://localhost:3000/src/assets/profiles/3.svg"
    christmas = "http://localhost:3000/src/assets/profiles/4.svg"
    man2 = "http://localhost:3000/src/assets/profiles/5.svg"
    avocado = "http://localhost:3000/src/assets/profiles/6.svg"

    avatars_user = {
        (heisenberg, heisenberg),
        (man, man),
        (man1, man1),
        (christmas, christmas),
        (man2, man2),
        (avocado, avocado),
    }
    avatar = models.CharField(blank=True, choices=avatars_user)
    omniauth = models.BooleanField(default=False)

    class Meta:
        permissions = [
            ("omniauth", "user from omniauth"),
            ("regularauth", "user from regular auth"),
        ]
