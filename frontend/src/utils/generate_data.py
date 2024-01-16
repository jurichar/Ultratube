from faker import Faker
import json
import random


fake = Faker()

def movies ():
    return {
        'id': fake.uuid4(),
        'title': fake.sentence(),
        'release': fake.date(),
        'image': fake.image_url(),
        'synopsis': fake.text(),
        'views': random.randint(0, 1000),
        'url': fake.url()
    }

def users ( movies ):
    return {
        'id': fake.uuid4(),
        'name': fake.name(),
        'email': fake.email(),
        'password': fake.password(),
        'avatar': fake.image_url(),
        'favorites': [random.choice(movies)['id'] for _ in range(5)]
    }

def trending ():
    return {
        'id': fake.uuid4(),
        'title': fake.sentence(),
        'release': fake.date(),
        'image': fake.image_url(),
        'synopsis': fake.text(),
        'trailer': fake.url(),
        'url': fake.url()
    }

def comments ( users, movies ):
    return {
        'id': fake.uuid4(),
        'user_id': random.choice(users)['id'],
        'movie_id': random.choice(movies)['id'],
        'content': fake.text(),
        'date': fake.date()
    }


def generate_fake_data ( n ):
    movies_list = [movies() for _ in range(n)]
    users_list = [users(movies_list) for _ in range(n)]
    trending_list = [trending() for _ in range(n)]
    comments_list = [comments(users_list, movies_list) for _ in range(n)]
    return {
        'movies': movies_list,
        'users': users_list,
        'trending': trending_list,
        'comments': comments_list
    }

def save_to_json ( data, filename ):
    with open(filename, 'w') as f:
        json.dump(data, f)

if __name__ == "__main__":
    fake_data = generate_fake_data(100)
    for key in fake_data:
        save_to_json(fake_data[key], f'./{key}.json')

# Movies [id, title, release, image, synopsis, trailer, url]
# Users [id, name, email, password, avatar, favorites]
# Trending [id, movie_id, date]
# Comments [id, user_id, movie_id, content, date]
