# Generated by Django 5.0.1 on 2024-02-13 21:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0002_alter_user_options_user_avatar_user_omniauth'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='avatar',
            field=models.CharField(blank=True, choices=[('http://localhost:3000/src/assets/profiles/2.svg', 'http://localhost:3000/src/assets/profiles/2.svg'), ('http://localhost:3000/src/assets/profiles/3.svg', 'http://localhost:3000/src/assets/profiles/3.svg'), ('http://localhost:3000/src/assets/profiles/4.svg', 'http://localhost:3000/src/assets/profiles/4.svg'), ('http://localhost:3000/src/assets/profiles/6.svg', 'http://localhost:3000/src/assets/profiles/6.svg'), ('http://localhost:3000/src/assets/profiles/1.svg', 'http://localhost:3000/src/assets/profiles/1.svg'), ('http://localhost:3000/src/assets/profiles/5.svg', 'http://localhost:3000/src/assets/profiles/5.svg')]),
        ),
    ]
