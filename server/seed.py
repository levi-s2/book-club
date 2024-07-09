from models import db, User, Book, Post, Genre, BookClub, Membership, CurrentReading, PostVotes
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
            Book(title="The Adventures of Sherlock Holmes", author="Arthur Conan Doyle", image_url="https://via.placeholder.com/150", genre=genres[4]),
            Book(title="Animal Farm", author="George Orwell", image_url="https://via.placeholder.com/150", genre=genres[3]),
            Book(title="Sense and Sensibility", author="Jane Austen", image_url="https://via.placeholder.com/150", genre=genres[5]),
            Book(title="Wuthering Heights", author="Emily Brontë", image_url="https://via.placeholder.com/150", genre=genres[5]),
            Book(title="The Silmarillion", author="J.R.R. Tolkien", image_url="https://via.placeholder.com/150", genre=genres[2]),
            Book(title="A Tale of Two Cities", author="Charles Dickens", image_url="https://via.placeholder.com/150", genre=genres[0]),
            Book(title="David Copperfield", author="Charles Dickens", image_url="https://via.placeholder.com/150", genre=genres[0]),
            Book(title="Great Expectations", author="Charles Dickens", image_url="https://via.placeholder.com/150", genre=genres[0]),
            Book(title="Oliver Twist", author="Charles Dickens", image_url="https://via.placeholder.com/150", genre=genres[0]),
            Book(title="Frankenstein", author="Mary Shelley", image_url="https://via.placeholder.com/150", genre=genres[2]),
            Book(title="Dracula", author="Bram Stoker", image_url="https://via.placeholder.com/150", genre=genres[4]),
            Book(title="Emma", author="Jane Austen", image_url="https://via.placeholder.com/150", genre=genres[5]),
            Book(title="Northanger Abbey", author="Jane Austen", image_url="https://via.placeholder.com/150", genre=genres[5]),
            Book(title="Persuasion", author="Jane Austen", image_url="https://via.placeholder.com/150", genre=genres[5]),
            Book(title="Mansfield Park", author="Jane Austen", image_url="https://via.placeholder.com/150", genre=genres[5]),
            Book(title="The Picture of Dorian Gray", author="Oscar Wilde", image_url="https://via.placeholder.com/150", genre=genres[0])
        ]
        db.session.add_all(books)
        db.session.commit()

        # Create Users
        users = [
            User(username="Alice", email="alice@example.com", password_hash=bcrypt.generate_password_hash("Password1!").decode('utf-8')),
            User(username="Bob", email="bob@example.com", password_hash=bcrypt.generate_password_hash("Password2!").decode('utf-8')),
            User(username="Charlie", email="charlie@example.com", password_hash=bcrypt.generate_password_hash("Password3!").decode('utf-8')),
            User(username="David", email="david@example.com", password_hash=bcrypt.generate_password_hash("Password4!").decode('utf-8')),
            User(username="Eve", email="eve@example.com", password_hash=bcrypt.generate_password_hash("Password5!").decode('utf-8')),
            User(username="Frank", email="frank@example.com", password_hash=bcrypt.generate_password_hash("Password6!").decode('utf-8')),
            User(username="Grace", email="grace@example.com", password_hash=bcrypt.generate_password_hash("Password7!").decode('utf-8')),
            User(username="Hank", email="hank@example.com", password_hash=bcrypt.generate_password_hash("Password8!").decode('utf-8')),
            User(username="Ivy", email="ivy@example.com", password_hash=bcrypt.generate_password_hash("Password9!").decode('utf-8')),
            User(username="Jack", email="jack@example.com", password_hash=bcrypt.generate_password_hash("Password10!").decode('utf-8'))
        ]
        db.session.add_all(users)
        db.session.commit()

        # Create BookClubs
        book_clubs = [
    BookClub(name="Classic Literature Club", description="A club for fans of classic literature.", created_by=1, genres=[genres[0]]),
    BookClub(name="Sci-Fi Enthusiasts", description="Exploring the world of science fiction.", created_by=2, genres=[genres[3]]),
    BookClub(name="Mystery Lovers", description="Discussing the best mystery novels.", created_by=3, genres=[genres[4]]),
    BookClub(name="Romance Readers", description="Sharing our favorite romance books.", created_by=4, genres=[genres[5]]),
    BookClub(name="Fantasy Fanatics", description="All about fantasy worlds.", created_by=5, genres=[genres[2]]),
    BookClub(name="Thriller Seekers", description="Thrilling stories and adventures.", created_by=6, genres=[genres[6]]),
    BookClub(name="Non-Fiction Network", description="Delving into non-fiction reads.", created_by=7, genres=[genres[1]]),
    BookClub(name="Historical Fiction", description="Exploring historical fiction.", created_by=8, genres=[genres[0]]),
    BookClub(name="Modern Classics", description="Modern classic literature.", created_by=9, genres=[genres[0]]),
    BookClub(name="Young Adult Reads", description="For fans of young adult books.", created_by=10, genres=[genres[0]])
]
        db.session.add_all(book_clubs)
        db.session.commit()

        # Create Memberships
        memberships = [
            Membership(user_id=1, book_club_id=1),
            Membership(user_id=2, book_club_id=1),
            Membership(user_id=3, book_club_id=2),
            Membership(user_id=4, book_club_id=2),
            Membership(user_id=5, book_club_id=3),
            Membership(user_id=6, book_club_id=3),
            Membership(user_id=7, book_club_id=4),
            Membership(user_id=8, book_club_id=4),
            Membership(user_id=9, book_club_id=5),
            Membership(user_id=10, book_club_id=5)
        ]
        db.session.add_all(memberships)
        db.session.commit()

        # Create CurrentReadings
        current_readings = [
            CurrentReading(book_club_id=1, book_id=1, started_at=datetime.datetime.now(datetime.timezone.utc)),
            CurrentReading(book_club_id=2, book_id=2, started_at=datetime.datetime.now(datetime.timezone.utc)),
            CurrentReading(book_club_id=3, book_id=3, started_at=datetime.datetime.now(datetime.timezone.utc)),
            CurrentReading(book_club_id=4, book_id=4, started_at=datetime.datetime.now(datetime.timezone.utc)),
            CurrentReading(book_club_id=5, book_id=5, started_at=datetime.datetime.now(datetime.timezone.utc)),
            CurrentReading(book_club_id=6, book_id=6, started_at=datetime.datetime.now(datetime.timezone.utc)),
            CurrentReading(book_club_id=7, book_id=7, started_at=datetime.datetime.now(datetime.timezone.utc)),
            CurrentReading(book_club_id=8, book_id=8, started_at=datetime.datetime.now(datetime.timezone.utc)),
            CurrentReading(book_club_id=9, book_id=9, started_at=datetime.datetime.now(datetime.timezone.utc)),
            CurrentReading(book_club_id=10, book_id=10, started_at=datetime.datetime.now(datetime.timezone.utc))
        ]
        db.session.add_all(current_readings)
        db.session.commit()

        # Create Posts
        posts = [
            Post(content="Great book! Really enjoyed it.", user_id=1, book_id=1, book_club_id=1),
            Post(content="Loved it! A masterpiece.", user_id=1, book_id=2, book_club_id=1),
            Post(content="A must-read for everyone.", user_id=2, book_id=3, book_club_id=2),
            Post(content="Highly recommend this book.", user_id=2, book_id=4, book_club_id=2),
            Post(content="An absolute classic tale.", user_id=3, book_id=5, book_club_id=3),
            Post(content="Very insightful and thought-provoking.", user_id=3, book_id=6, book_club_id=3),
            Post(content="Beautifully written novel.", user_id=4, book_id=7, book_club_id=1),
            Post(content="Couldn't put it down!", user_id=4, book_id=8, book_club_id=2),
            Post(content="A bit slow, but worth it.", user_id=5, book_id=9, book_club_id=3),
            Post(content="Fantastic story! Well done.", user_id=5, book_id=10, book_club_id=1),
            Post(content="Amazing world-building.", user_id=1, book_id=11, book_club_id=4),
            Post(content="Incredibly imaginative.", user_id=2, book_id=12, book_club_id=5),
            Post(content="One of the best sci-fi books.", user_id=3, book_id=13, book_club_id=6),
            Post(content="Thoroughly enjoyed the mystery.", user_id=4, book_id=14, book_club_id=7),
            Post(content="A gripping thriller.", user_id=5, book_id=15, book_club_id=8),
            Post(content="Couldn't stop reading.", user_id=1, book_id=16, book_club_id=9),
            Post(content="A beautiful love story.", user_id=2, book_id=17, book_club_id=10),
            Post(content="Thought-provoking and deep.", user_id=3, book_id=18, book_club_id=1),
            Post(content="Another great read.", user_id=4, book_id=19, book_club_id=2),
            Post(content="A modern classic.", user_id=5, book_id=20, book_club_id=3),
            Post(content="Masterfully written.", user_id=1, book_id=21, book_club_id=4),
            Post(content="Intriguing from start to finish.", user_id=2, book_id=22, book_club_id=5),
            Post(content="Couldn't put it down.", user_id=3, book_id=23, book_club_id=6),
            Post(content="An excellent mystery.", user_id=4, book_id=24, book_club_id=7),
            Post(content="A heartwarming romance.", user_id=5, book_id=25, book_club_id=8),
            Post(content="A deep and meaningful story.", user_id=1, book_id=26, book_club_id=9),
            Post(content="An exciting adventure.", user_id=2, book_id=27, book_club_id=10),
            Post(content="A powerful narrative.", user_id=3, book_id=28, book_club_id=1),
            Post(content="A must-read for everyone.", user_id=4, book_id=29, book_club_id=2),
            Post(content="An unforgettable tale.", user_id=5, book_id=30, book_club_id=3)
        ]
        db.session.add_all(posts)
        db.session.commit()

        # Create PostVotess
        post_votes = [
            PostVotes(post_id=1, user_id=2, vote=1),
            PostVotes(post_id=2, user_id=3, vote=1),
            PostVotes(post_id=3, user_id=4, vote=1),
            PostVotes(post_id=4, user_id=5, vote=1),
            PostVotes(post_id=5, user_id=1, vote=1),
            PostVotes(post_id=6, user_id=2, vote=-1),
            PostVotes(post_id=7, user_id=3, vote=1),
            PostVotes(post_id=8, user_id=4, vote=1),
            PostVotes(post_id=9, user_id=5, vote=1),
            PostVotes(post_id=10, user_id=1, vote=-1),
            PostVotes(post_id=11, user_id=2, vote=1),
            PostVotes(post_id=12, user_id=3, vote=1),
            PostVotes(post_id=13, user_id=4, vote=1),
            PostVotes(post_id=14, user_id=5, vote=1),
            PostVotes(post_id=15, user_id=1, vote=1),
            PostVotes(post_id=16, user_id=2, vote=-1),
            PostVotes(post_id=17, user_id=3, vote=1),
            PostVotes(post_id=18, user_id=4, vote=1),
            PostVotes(post_id=19, user_id=5, vote=1),
            PostVotes(post_id=20, user_id=1, vote=-1),
            PostVotes(post_id=21, user_id=2, vote=1),
            PostVotes(post_id=22, user_id=3, vote=1),
            PostVotes(post_id=23, user_id=4, vote=1),
            PostVotes(post_id=24, user_id=5, vote=1),
            PostVotes(post_id=25, user_id=1, vote=1),
            PostVotes(post_id=26, user_id=2, vote=-1),
            PostVotes(post_id=27, user_id=3, vote=1),
            PostVotes(post_id=28, user_id=4, vote=1),
            PostVotes(post_id=29, user_id=5, vote=1),
            PostVotes(post_id=30, user_id=1, vote=-1)
        ]
        db.session.add_all(post_votes)
        db.session.commit()

if __name__ == '__main__':
    seed_database()
