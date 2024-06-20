from models import db, User, Book, Review, Genre, BookClub, Membership, CurrentReading
from app import app, bcrypt
import datetime

def seed_database():
    with app.app_context():
        db.drop_all()
        db.create_all()

        # Create Genres
        genres = [
            Genre(name="Fiction"),
            Genre(name="Non-Fiction"),
            Genre(name="Fantasy"),
            Genre(name="Science Fiction"),
            Genre(name="Mystery"),
            Genre(name="Romance"),
            Genre(name="Thriller")
        ]
        db.session.add_all(genres)
        db.session.commit()

        # Create Books
        books = [
            Book(title="The Great Gatsby", author="F. Scott Fitzgerald", image_url="https://via.placeholder.com/150", genre=genres[0]),
            Book(title="1984", author="George Orwell", image_url="https://via.placeholder.com/150", genre=genres[3]),
            Book(title="To Kill a Mockingbird", author="Harper Lee", image_url="https://via.placeholder.com/150", genre=genres[0]),
            Book(title="The Catcher in the Rye", author="J.D. Salinger", image_url="https://via.placeholder.com/150", genre=genres[0]),
            Book(title="The Hobbit", author="J.R.R. Tolkien", image_url="https://via.placeholder.com/150", genre=genres[2]),
            Book(title="Fahrenheit 451", author="Ray Bradbury", image_url="https://via.placeholder.com/150", genre=genres[3]),
            Book(title="Pride and Prejudice", author="Jane Austen", image_url="https://via.placeholder.com/150", genre=genres[5]),
            Book(title="Moby-Dick", author="Herman Melville", image_url="https://via.placeholder.com/150", genre=genres[0]),
            Book(title="War and Peace", author="Leo Tolstoy", image_url="https://via.placeholder.com/150", genre=genres[0]),
            Book(title="The Odyssey", author="Homer", image_url="https://via.placeholder.com/150", genre=genres[2]),
            Book(title="Crime and Punishment", author="Fyodor Dostoevsky", image_url="https://via.placeholder.com/150", genre=genres[4]),
            Book(title="Brave New World", author="Aldous Huxley", image_url="https://via.placeholder.com/150", genre=genres[3]),
            Book(title="The Lord of the Rings", author="J.R.R. Tolkien", image_url="https://via.placeholder.com/150", genre=genres[2]),
            Book(title="Jane Eyre", author="Charlotte Brontë", image_url="https://via.placeholder.com/150", genre=genres[5]),
            Book(title="The Adventures of Sherlock Holmes", author="Arthur Conan Doyle", image_url="https://via.placeholder.com/150", genre=genres[4])
        ]
        db.session.add_all(books)
        db.session.commit()

        # Create Users
        users = [
            User(username="user1", email="user1@example.com", password_hash=bcrypt.generate_password_hash("Password1!").decode('utf-8')),
            User(username="user2", email="user2@example.com", password_hash=bcrypt.generate_password_hash("Password2!").decode('utf-8')),
            User(username="user3", email="user3@example.com", password_hash=bcrypt.generate_password_hash("Password3!").decode('utf-8')),
            User(username="user4", email="user4@example.com", password_hash=bcrypt.generate_password_hash("Password4!").decode('utf-8')),
            User(username="user5", email="user5@example.com", password_hash=bcrypt.generate_password_hash("Password5!").decode('utf-8'))
        ]
        db.session.add_all(users)
        db.session.commit()

        # Create BookClubs
        book_clubs = [
            BookClub(name="Classic Literature Club", description="A club for fans of classic literature.", created_by=1),
            BookClub(name="Sci-Fi Enthusiasts", description="Exploring the world of science fiction.", created_by=2),
            BookClub(name="Mystery Lovers", description="Discussing the best mystery novels.", created_by=3)
        ]
        db.session.add_all(book_clubs)
        db.session.commit()

        # Create Memberships
        memberships = [
            Membership(user_id=1, book_club_id=1),
            Membership(user_id=2, book_club_id=1),
            Membership(user_id=3, book_club_id=2),
            Membership(user_id=4, book_club_id=2),
            Membership(user_id=5, book_club_id=3)
        ]
        db.session.add_all(memberships)
        db.session.commit()

        # Create CurrentReadings
        current_readings = [
            CurrentReading(book_club_id=1, book_id=1, started_at=datetime.datetime.now(datetime.timezone.utc)),
            CurrentReading(book_club_id=2, book_id=2, started_at=datetime.datetime.now(datetime.timezone.utc)),
            CurrentReading(book_club_id=3, book_id=3, started_at=datetime.datetime.now(datetime.timezone.utc))
        ]
        db.session.add_all(current_readings)
        db.session.commit()

        # Create Reviews
        reviews = [
            Review(content="Great book! Really enjoyed it.", rating=5, user_id=1, book_id=1, book_club_id=1),
            Review(content="Loved it! A masterpiece.", rating=5, user_id=1, book_id=2, book_club_id=1),
            Review(content="A must-read for everyone.", rating=5, user_id=2, book_id=3, book_club_id=2),
            Review(content="Highly recommend this book.", rating=4, user_id=2, book_id=4, book_club_id=2),
            Review(content="An absolute classic tale.", rating=5, user_id=3, book_id=5, book_club_id=3),
            Review(content="Very insightful and thought-provoking.", rating=4, user_id=3, book_id=6, book_club_id=3),
            Review(content="Beautifully written novel.", rating=5, user_id=4, book_id=7, book_club_id=1),
            Review(content="Couldn't put it down!", rating=5, user_id=4, book_id=8, book_club_id=2),
            Review(content="A bit slow, but worth it.", rating=3, user_id=5, book_id=9, book_club_id=3),
            Review(content="Fantastic story! Well done.", rating=5, user_id=5, book_id=10, book_club_id=1)
        ]
        db.session.add_all(reviews)
        db.session.commit()

if __name__ == '__main__':
    seed_database()
