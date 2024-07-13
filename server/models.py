from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData, Integer, String, Text, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship, validates
from flask_bcrypt import Bcrypt
import datetime

metadata = MetaData()
db = SQLAlchemy(metadata=metadata)
bcrypt = Bcrypt()

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(Integer, primary_key=True)
    username = db.Column(String, unique=True, nullable=False)
    email = db.Column(String, unique=True, nullable=False)
    _password_hash = db.Column(String, nullable=False)

    book_clubs_created = relationship('BookClub', back_populates='creator')
    memberships = relationship('Membership', back_populates='user')
    posts = relationship('Post', back_populates='user')
    post_votes = relationship('PostVotes', back_populates='user')

    @property
    def password_hash(self):
        return self._password_hash

    @password_hash.setter
    def password_hash(self, password):
        if len(password) < 6:
            raise ValueError("Password must be at least 6 characters long")
        self._password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def authenticate(self, password):
        return bcrypt.check_password_hash(self._password_hash, password)

    @validates('email')
    def validate_email(self, key, address):
        assert '@' in address
        return address

    @validates('username')
    def validate_username(self, key, username):
        assert username is not None and len(username) > 0
        return username

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'created_clubs': [club.id for club in self.book_clubs_created]
        }

    def __repr__(self):
        return f'<User {self.id}. {self.username}>'


book_club_genres = db.Table('book_club_genres',
    db.Column('book_club_id', db.Integer, db.ForeignKey('book_clubs.id'), primary_key=True),
    db.Column('genre_id', db.Integer, db.ForeignKey('genres.id'), primary_key=True)
)


class BookClub(db.Model):
    __tablename__ = 'book_clubs'
    
    id = db.Column(Integer, primary_key=True)
    name = db.Column(String, nullable=False)
    description = db.Column(Text, nullable=True)
    created_by = db.Column(Integer, ForeignKey('users.id'), nullable=False)
    created_at = db.Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc))

    creator = relationship('User', back_populates='book_clubs_created')
    members = relationship('Membership', back_populates='book_club', cascade="all, delete-orphan")
    current_reading = relationship('CurrentReading', uselist=False, back_populates='book_club', cascade="all, delete-orphan")
    genres = db.relationship('Genre', secondary=book_club_genres, back_populates='book_clubs', cascade="all, delete")
    posts = relationship('Post', back_populates='book_club', cascade="all, delete-orphan")

    @validates('name')
    def validate_name(self, key, name):
        assert name is not None and len(name) > 0
        return name

    def to_dict(self, user_id=None):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'created_at': self.created_at.isoformat(),
            'creator': {
                'id': self.creator.id,
                'username': self.creator.username
            } if self.creator else None,
            'members': [{'id': member.user.id, 'username': member.user.username} for member in self.members],
            'current_book': self.current_reading.book.to_dict() if self.current_reading else None,
            'genres': [{'id': genre.id, 'name': genre.name} for genre in self.genres],
            'is_member': user_id in [member.user.id for member in self.members],
            'posts': [post.to_dict(user_id=user_id) for post in self.posts]
        }

    def __repr__(self):
        return f'<BookClub {self.id}. {self.name}>'



class Book(db.Model):
    __tablename__ = 'books'
    
    id = db.Column(Integer, primary_key=True)
    title = db.Column(String, nullable=False)
    author = db.Column(String, nullable=False)
    image_url = db.Column(String, nullable=True)
    genre_id = db.Column(Integer, ForeignKey('genres.id'), nullable=False)

    genre = relationship('Genre', back_populates='books')
    current_reading = relationship('CurrentReading', back_populates='book')
    posts = relationship('Post', back_populates='book')

    @validates('title')
    def validate_title(self, key, title):
        assert title is not None and len(title) > 0
        return title

    @validates('author')
    def validate_author(self, key, author):
        assert author is not None and len(author) > 0
        return author

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'author': self.author,
            'image_url': self.image_url,
            'genre': self.genre.to_dict() if self.genre else None
        }

    def __repr__(self):
        return f'<Book {self.id}. {self.title}>'



class Genre(db.Model):
    __tablename__ = 'genres'
    
    id = db.Column(Integer, primary_key=True)
    name = db.Column(String, nullable=False, unique=True)

    books = relationship('Book', back_populates='genre')
    book_clubs = db.relationship('BookClub', secondary=book_club_genres, back_populates='genres')

    @validates('name')
    def validate_name(self, key, name):
        assert name is not None and len(name) > 0
        return name

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name
        }

    def __repr__(self):
        return f'<Genre {self.id}. {self.name}>'


class Membership(db.Model):
    __tablename__ = 'memberships'
    
    id = db.Column(Integer, primary_key=True)
    user_id = db.Column(Integer, ForeignKey('users.id'), nullable=False)
    book_club_id = db.Column(Integer, ForeignKey('book_clubs.id'), nullable=False)

    user = relationship('User', back_populates='memberships')
    book_club = relationship('BookClub', back_populates='members')

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'book_club_id': self.book_club_id,
            'user': self.user.to_dict()  
        }

    def __repr__(self):
        return f'<Membership {self.id}. User: {self.user_id}, BookClub: {self.book_club_id}>'



class CurrentReading(db.Model):
    __tablename__ = 'current_readings'
    
    id = db.Column(Integer, primary_key=True)
    book_club_id = db.Column(Integer, ForeignKey('book_clubs.id'), nullable=False)
    book_id = db.Column(Integer, ForeignKey('books.id'), nullable=False)
    started_at = db.Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc))

    book_club = relationship('BookClub', back_populates='current_reading')
    book = relationship('Book', back_populates='current_reading')

    def to_dict(self):
        return {
            'id': self.id,
            'book_club_id': self.book_club_id,
            'book_id': self.book_id,
            'started_at': self.started_at.isoformat(),
            'book': self.book.to_dict() 
        }

    def __repr__(self):
        return f'<CurrentReading {self.id}. BookClub: {self.book_club_id}, Book: {self.book_id}>'
    

class PostVotes(db.Model):
    __tablename__ = 'post_votes'
    
    id = db.Column(Integer, primary_key=True)
    post_id = db.Column(Integer, ForeignKey('posts.id'), nullable=False)
    user_id = db.Column(Integer, ForeignKey('users.id'), nullable=False)
    vote = db.Column(Integer, nullable=False)

    post = relationship('Post', back_populates='votes')
    user = relationship('User', back_populates='post_votes')

    __table_args__ = (UniqueConstraint('post_id', 'user_id', name='_post_user_uc'),)

    def to_dict(self):
        return {
            'id': self.id,
            'post_id': self.post_id,
            'user_id': self.user_id,
            'vote': self.vote
        }

    def __repr__(self):
        return f'<PostVotes {self.id}. Post: {self.post_id}, User: {self.user_id}, Vote: {self.vote}>'




class Post(db.Model):
    __tablename__ = 'posts'
    
    id = db.Column(Integer, primary_key=True)
    user_id = db.Column(Integer, ForeignKey('users.id'), nullable=False)
    book_id = db.Column(Integer, ForeignKey('books.id'), nullable=True)
    book_club_id = db.Column(Integer, ForeignKey('book_clubs.id'), nullable=False)
    content = db.Column(Text, nullable=False)
    created_at = db.Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc))
    updated_at = db.Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc), onupdate=lambda: datetime.datetime.now(datetime.timezone.utc))

    user = relationship('User', back_populates='posts')
    book = relationship('Book', back_populates='posts')
    book_club = relationship('BookClub', back_populates='posts')
    votes = relationship('PostVotes', back_populates='post', cascade="all, delete-orphan")

    def to_dict(self, user_id=None):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'username': self.user.username,
            'book_id': self.book_id,
            'book_club_id': self.book_club_id,
            'content': self.content,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'votes': sum(vote.vote for vote in self.votes),
            'user_voted': next((vote.vote for vote in self.votes if vote.user_id == user_id), None)
        }
    
    def __repr__(self):
        return f'<Post {self.id}. User: {self.user_id}, Book: {self.book_id}, BookClub: {self.book_club_id}>'

