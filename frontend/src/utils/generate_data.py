from faker import Faker
import json

fake = Faker()

def generate_fake_data(count):
    data = []
    for _ in range(count):
        movie = {
            "id": fake.uuid4(),
            "title": fake.sentence(nb_words=3),
            "release": fake.date_this_decade().isoformat(),
            "image": fake.image_url(),
            "synopsis": fake.text(),
            "trailer": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        }
        data.append(movie)
    return data

def save_to_json(data, filename):
    with open(filename, 'w') as json_file:
        json.dump(data, json_file, indent=2)

if __name__ == "__main__":
    fake_data = generate_fake_data(10)
    save_to_json(fake_data, 'data_trending.json')
    fake_data = generate_fake_data(100)
    save_to_json(fake_data, 'data_all.json')
