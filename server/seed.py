from server.app import create_app  # Updated import
from server.extensions import db  # Updated import
from server.models.user import User  # Updated import (assuming your file is user.py, not users.py)
from faker import Faker

app = create_app()  # Create app instance first
fake = Faker()

def seed_db():
    with app.app_context():
        # Drop all tables and create them fresh
        db.drop_all()
        db.create_all()

        # Manually created users
        user1 = User(username="john_doe", email="john@example.com", password="password123")
        user2 = User(username="jane_smith", email="jane@example.com", password="securepass")

        db.session.add_all([user1, user2])

        # Automatically create 10 fake users
        for _ in range(10):
            username = fake.user_name()
            email = fake.email()
            password = "testpassword"
            user = User(username=username, email=email, password=password)
            db.session.add(user)

        db.session.commit()
        print("Database seeded successfully with manual and fake users!")

if __name__ == "__main__":
    seed_db()