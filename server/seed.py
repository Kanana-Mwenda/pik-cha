from server.app import app, db
from models.user import User
from models.image import Image

from faker import Faker
from PIL import Image as PILImage, ImageDraw
import cloudinary.uploader
import io
import os

faker = Faker()

import cloudinary
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET")
)

def create_dummy_image(text='Pik-Cha', size=(800, 600), color=(255, 255, 255)):
    img = PILImage.new("RGB", size, color)
    draw = ImageDraw.Draw(img)
    draw.text((10, 10), text, fill=(0, 0, 0))
    return img

def upload_image_to_cloudinary(img, filename):
    buffer = io.BytesIO()
    img.save(buffer, format='JPEG')
    buffer.seek(0)
    return cloudinary.uploader.upload(buffer, public_id=f"seed/{filename}")

def seed_data():
    with app.app_context():
        db.drop_all()
        db.create_all()

        users = []
        for i in range(20):
            user = User(
                email=faker.email(),
                full_name=faker.name(),
                role='admin' if i == 0 else 'user',
                is_verified=True
            )
            user.set_password(faker.password())
            users.append(user)

        db.session.add_all(users)
        db.session.commit()

        for i in range(20):
            img = create_dummy_image(text=faker.word())
            filename = f"img_{i}_{faker.uuid4()[:8]}"

            result = upload_image_to_cloudinary(img, filename)

            new_image = Image(
                filename=filename + ".jpg",
                public_id=result["public_id"],
                format=result["format"],
                width=result["width"],
                height=result["height"],
                url=result["secure_url"],
                user_id=users[i % 20].id  
            )
            db.session.add(new_image)

        db.session.commit()
        print("✅ Seeded database with 20 users and 20 uploaded images.")

if _name_ == '_main_':
    seed_data()