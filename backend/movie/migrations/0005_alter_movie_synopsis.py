# Generated by Django 5.0.1 on 2024-01-16 13:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('movie', '0004_alter_movie_synopsis'),
    ]

    operations = [
        migrations.AlterField(
            model_name='movie',
            name='synopsis',
            field=models.TextField(blank=True, null=True),
        ),
    ]
