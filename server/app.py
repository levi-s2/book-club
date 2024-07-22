from flask import Flask, jsonify, request, make_response
import datetime
from flask_migrate import Migrate
from flask_cors import CORS
from flask_restful import Api, Resource
from flask_jwt_extended import JWTManager, create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from models import db, bcrypt, User, Book, BookClub, Genre, Membership, CurrentReading, Post, PostVotes, user_books
from datetime import timedelta
import os
import traceback

app = Flask(__name__)
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DATABASE = os.environ.get("DB_URI", f"sqlite:///{os.path.join(BASE_DIR, 'app.db')}")
app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'secret_key'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(minutes=15)
app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=30)

migrate = Migrate(app, db)
db.init_app(app)
bcrypt.init_app(app)
api = Api(app)
CORS(app, resources={r"*": {"origins": "*"}}, supports_credentials=True)
jwt = JWTManager(app)

class Home(Resource):
    def get(self):
        response_dict = {"message": "Book Club API"}
        response = make_response(jsonify(response_dict), 200)
        return response

api.add_resource(Home, '/')

class Books(Resource):
    def get(self):
        genre_ids = request.args.getlist('genre_ids')
        if genre_ids:
            books = Book.query.join(Book.genres).filter(Genre.id.in_(genre_ids)).all()
        else:
            books = Book.query.all()
        response_dict_list = [book.to_dict() for book in books]
        response = make_response(jsonify(response_dict_list), 200)
        return response


class Genres(Resource):
    def get(self):
        response_dict_list = [genre.to_dict() for genre in Genre.query.all()]
        response = make_response(jsonify(response_dict_list), 200)
        return response

class Authors(Resource):
    def get(self):
        authors = db.session.query(Book.author).distinct().all()
        author_list = [author[0] for author in authors]
        response = make_response(jsonify(author_list), 200)
        return response

api.add_resource(Books, '/books')
api.add_resource(Genres, '/genres')
api.add_resource(Authors, '/authors')


class Register(Resource):
    def post(self):
        try:
            data = request.get_json()
            username = data.get('username')
            email = data.get('email')
            password = data.get('password')

            if not username or not email or not password:
                return {"message": "Username, email, and password are required"}, 400

            existing_user = User.query.filter((User.username == username) | (User.email == email)).first()
            if existing_user:
                return {"message": "User with provided username or email already exists"}, 400

            new_user = User(username=username, email=email)
            new_user.password_hash = password

            db.session.add(new_user)
            db.session.commit()

            return {"message": "User created successfully"}, 201
        except Exception as e:
            print(f"Error during registration: {e}")
            traceback.print_exc()
            return {"message": "Internal Server Error"}, 500
        

class UserDetail(Resource):
    @jwt_required()
    def get(self, user_id):
        try:
            user = User.query.get(user_id)
            if not user:
                return {"message": "User not found"}, 404
            return user.to_dict(), 200
        except Exception as e:
            print(f"Error fetching user: {e}")
            traceback.print_exc()
            return {"message": "Internal Server Error"}, 500

    @jwt_required()
    def patch(self, user_id):
        try:
            user = User.query.get(user_id)
            if not user:
                return {"message": "User not found"}, 404

            data = request.get_json()
            dark_mode = data.get('dark_mode')

            if dark_mode is not None:
                user.dark_mode = dark_mode
                db.session.commit()
                return {"message": "User theme preference updated"}, 200
            else:
                return {"message": "Invalid data"}, 400

        except Exception as e:
            print(f"Error updating user theme preference: {e}")
            traceback.print_exc()
            return {"message": "Internal Server Error"}, 500

api.add_resource(UserDetail, '/users/<int:user_id>', endpoint='user_detail_endpoint')


class UserBooks(Resource):
    @jwt_required()
    def get(self):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        user_books_with_ratings = []

        for book in user.books:
            user_book = db.session.query(user_books).filter_by(user_id=user_id, book_id=book.id).first()
            user_books_with_ratings.append({
                'id': book.id,
                'title': book.title,
                'author': book.author,
                'image_url': book.image_url,
                'rating': user_book.rating if user_book else None
            })

        return make_response(jsonify(user_books_with_ratings), 200)

    @jwt_required()
    def post(self):
        try:
            user_id = get_jwt_identity()
            data = request.get_json()
            book_id = data.get('bookId')
            rating = data.get('rating') 
            user = User.query.get(user_id)
            book = Book.query.get(book_id)

            if not book:
                return make_response({"message": "Book not found"}, 404)

            if book in user.books:
                return make_response({"message": "Book already in list"}, 400)

            user.books.append(book)
            db.session.commit()

            user_book = db.session.query(user_books).filter_by(user_id=user_id, book_id=book_id).first()
            if user_book:
                db.session.execute(
                    user_books.update().
                    where(user_books.c.user_id == user_id).
                    where(user_books.c.book_id == book_id).
                    values(rating=rating)
                )
                db.session.commit()

            return make_response({"message": "Book added to list"}, 201)
        except Exception as e:
            traceback.print_exc()
            return make_response({"message": "Internal Server Error"}, 500)

    @jwt_required()
    def patch(self, book_id):
        try:
            user_id = get_jwt_identity()
            data = request.get_json()
            rating = data.get('rating')
            user_book = db.session.query(user_books).filter_by(user_id=user_id, book_id=book_id).first()

            if not user_book:
                return make_response({"message": "Book not in list"}, 400)

            db.session.execute(
                user_books.update().
                where(user_books.c.user_id == user_id).
                where(user_books.c.book_id == book_id).
                values(rating=rating)
            )
            db.session.commit()

            return make_response({"message": "Rating updated"}, 200)
        except Exception as e:
            traceback.print_exc()
            return make_response({"message": "Internal Server Error"}, 500)

    @jwt_required()
    def delete(self, book_id):
        try:
            user_id = get_jwt_identity()
            user = User.query.get(user_id)
            book = Book.query.get(book_id)

            if book not in user.books:
                return make_response({"message": "Book not in list"}, 400)

            user.books.remove(book)
            db.session.commit()

            return make_response({"message": "Book removed from list"}, 200)
        except Exception as e:
            traceback.print_exc()
            return make_response({"message": "Internal Server Error"}, 500)

api.add_resource(UserBooks, '/user/books', '/user/books/<int:book_id>')


class AddFriend(Resource):
    @jwt_required()
    def post(self, friend_id):
        try:
            user_id = get_jwt_identity()
            user = User.query.get(user_id)
            friend = User.query.get(friend_id)

            if not friend:
                return {"message": "Friend not found"}, 404

            if friend in user.friends:
                return {"message": "Already friends"}, 400

            user.friends.append(friend)
            db.session.commit()
            return {"message": "Friend added successfully"}, 201
        except Exception as e:
            print(f"Error adding friend: {e}")
            traceback.print_exc()
            return {"message": "Internal Server Error"}, 500

api.add_resource(AddFriend, '/users/<int:friend_id>/add-friend', endpoint='add_friend_endpoint')


class RemoveFriend(Resource):
    @jwt_required()
    def delete(self, friend_id):
        try:
            user_id = get_jwt_identity()
            user = User.query.get(user_id)
            friend = User.query.get(friend_id)

            if not friend:
                return {"message": "Friend not found"}, 404

            if friend not in user.friends:
                return {"message": "Not friends"}, 400

            user.friends.remove(friend)
            db.session.commit()
            return {"message": "Friend removed successfully"}, 200
        except Exception as e:
            print(f"Error removing friend: {e}")
            traceback.print_exc()
            return {"message": "Internal Server Error"}, 500

api.add_resource(RemoveFriend, '/users/<int:friend_id>/remove-friend', endpoint='remove_friend_endpoint')



class Login(Resource):
    def post(self):
        try:
            data = request.get_json()
            email = data.get('email')
            password = data.get('password')

            user = User.query.filter_by(email=email).first()
            if not user or not user.authenticate(password):
                return {"message": "Invalid email or password"}, 401

            access_token = create_access_token(identity=user.id)
            refresh_token = create_refresh_token(identity=user.id)
            return {
                "access_token": access_token,
                "refresh_token": refresh_token,
                "user": user.to_dict()
            }, 200
        except Exception as e:
            print(f"Error during login: {e}")
            traceback.print_exc()
            return {"message": "Internal Server Error"}, 500

class TokenRefresh(Resource):
    @jwt_required(refresh=True)
    def post(self):
        current_user_id = get_jwt_identity()
        new_access_token = create_access_token(identity=current_user_id)
        return {"access_token": new_access_token}, 200

class Protected(Resource):
    @jwt_required()
    def get(self):
        try:
            current_user_id = get_jwt_identity()
            user = User.query.get(current_user_id)
            return {"username": user.username, "email": user.email}, 200
        except Exception as e:
            print(f"Error in protected resource: {e}")
            traceback.print_exc()
            return {"message": "Internal Server Error"}, 500

api.add_resource(Register, '/register', endpoint='register_endpoint')
api.add_resource(Login, '/login', endpoint='login_endpoint')
api.add_resource(TokenRefresh, '/refresh', endpoint='refresh_endpoint')
api.add_resource(Protected, '/protected', endpoint='protected_endpoint')


class BookClubs(Resource):
    @jwt_required()
    def get(self):
        try:
            book_clubs = BookClub.query.all()
            response_dict_list = [book_club.to_dict() for book_club in book_clubs]
            return make_response(jsonify(response_dict_list), 200)
        except Exception as e:
            print(f"Error fetching book clubs: {e}")
            traceback.print_exc()
            return {"message": "Internal Server Error"}, 500

    @jwt_required()
    def post(self):
        try:
            user_id = get_jwt_identity()
            data = request.get_json()
            name = data.get('name')
            description = data.get('description')
            genre_ids = data.get('genre_ids')

            if not name or not genre_ids or len(genre_ids) == 0:
                return {"message": "Name and at least one genre are required"}, 400

            existing_club = BookClub.query.filter_by(created_by=user_id).first()
            if existing_club:
                return {"message": "You have already created a book club"}, 400

            new_club = BookClub(name=name, description=description, created_by=user_id)
            db.session.add(new_club)
            db.session.commit()

            for genre_id in genre_ids:
                genre = Genre.query.get(genre_id)
                if genre:
                    new_club.genres.append(genre)
            
            db.session.commit()

            return {"message": "Book club created successfully", "club": new_club.to_dict()}, 201

        except Exception as e:
            print(f"Error during book club creation: {e}")
            traceback.print_exc()
            return {"message": "Internal Server Error"}, 500

api.add_resource(BookClubs, '/book-clubs', endpoint='book_clubs_endpoint')



class ClubPosts(Resource):
    @jwt_required()
    def post(self, club_id):
        try:
            user_id = get_jwt_identity()
            data = request.get_json()
            content = data.get('content')
            if not content:
                return {"message": "Content cannot be empty"}, 400

            post = Post(user_id=user_id, book_club_id=club_id, content=content)
            db.session.add(post)
            db.session.commit()
            return make_response(jsonify(post.to_dict()), 201)
        except Exception as e:
            print(f"Error creating post: {e}")
            traceback.print_exc()
            return {"message": "Internal Server Error"}, 500

api.add_resource(ClubPosts, '/book-clubs/<int:club_id>/posts', endpoint='club_posts_endpoint')


class PostManagement(Resource):
    @jwt_required()
    def patch(self, post_id):
        try:
            user_id = get_jwt_identity()
            data = request.get_json()
            content = data.get('content')
            post = Post.query.get_or_404(post_id)
            if post.user_id != user_id:
                return {"message": "Unauthorized"}, 403

            post.content = content
            post.updated_at = datetime.datetime.now(datetime.timezone.utc)
            db.session.commit()
            return make_response(jsonify(post.to_dict()), 200)
        except Exception as e:
            print(f"Error updating post: {e}")
            traceback.print_exc()
            return {"message": "Internal Server Error"}, 500

    @jwt_required()
    def delete(self, post_id):
        try:
            user_id = get_jwt_identity()
            post = Post.query.get_or_404(post_id)
            if post.user_id != user_id:
                return {"message": "Unauthorized"}, 403

            db.session.delete(post)
            db.session.commit()
            return {"message": "Post deleted successfully"}, 200
        except Exception as e:
            print(f"Error deleting post: {e}")
            traceback.print_exc()
            return {"message": "Internal Server Error"}, 500

api.add_resource(PostManagement, '/posts/<int:post_id>', endpoint='post_management_endpoint')


class PostVote(Resource):
    @jwt_required()
    def post(self, post_id):
        try:
            user_id = get_jwt_identity()
            data = request.get_json()
            vote = data.get('vote')
            if vote not in [-1, 1]:
                return {"message": "Invalid vote value"}, 400

            post_vote = PostVotes.query.filter_by(post_id=post_id, user_id=user_id).first()

            if post_vote:
                if post_vote.vote == vote:
                    db.session.delete(post_vote)
                else:
                    post_vote.vote = vote
            else:
                post_vote = PostVotes(post_id=post_id, user_id=user_id, vote=vote)
                db.session.add(post_vote)

            db.session.commit()
            updated_post = Post.query.get_or_404(post_id)
            return make_response(jsonify(updated_post.to_dict(user_id=user_id)), 200)
        except Exception as e:
            print(f"Error voting on post: {e}")
            traceback.print_exc()
            return {"message": "Internal Server Error"}, 500

api.add_resource(PostVote, '/posts/<int:post_id>/vote', endpoint='post_vote_endpoint')




class BookClubDetails(Resource):
    @jwt_required()
    def get(self, club_id):
        user_id = get_jwt_identity()
        book_club = BookClub.query.get_or_404(club_id)
        response_dict = book_club.to_dict(user_id=user_id)
        response = make_response(jsonify(response_dict), 200)
        return response

    @jwt_required()
    def post(self, club_id):
        user_id = get_jwt_identity()
        book_club = BookClub.query.get_or_404(club_id)
        if not Membership.query.filter_by(user_id=user_id, book_club_id=club_id).first():
            membership = Membership(user_id=user_id, book_club_id=club_id)
            db.session.add(membership)
            db.session.commit()
        response_dict = book_club.to_dict(user_id=user_id)
        response = make_response(jsonify(response_dict), 200)
        return response

    @jwt_required()
    def delete(self, club_id):
        user_id = get_jwt_identity()
        membership = Membership.query.filter_by(user_id=user_id, book_club_id=club_id).first()
        if membership:
            db.session.delete(membership)
            db.session.commit()
        book_club = BookClub.query.get_or_404(club_id)
        response_dict = book_club.to_dict(user_id=user_id)
        response = make_response(jsonify(response_dict), 200)
        return response

api.add_resource(BookClubDetails, '/book-clubs/<int:club_id>')



class MyClubs(Resource):
    @jwt_required()
    def get(self):
        user_id = get_jwt_identity()
        memberships = Membership.query.filter_by(user_id=user_id).all()
        book_clubs = [membership.book_club.to_dict() for membership in memberships]
        response = make_response(jsonify(book_clubs), 200)
        return response

api.add_resource(MyClubs, '/my-clubs')


class ManageClub(Resource):
    @jwt_required()
    def get(self, club_id):
        user_id = get_jwt_identity()
        book_club = BookClub.query.get_or_404(club_id)
        if book_club.created_by != user_id:
            return {"message": "Unauthorized"}, 403
        return jsonify(book_club.to_dict(user_id=user_id))

    @jwt_required()
    def patch(self, club_id):
        data = request.get_json()
        action = data.get('action')
        user_id = get_jwt_identity()
        book_club = BookClub.query.get_or_404(club_id)

        if book_club.created_by != user_id:
            return {"message": "You are not authorized to manage this club"}, 403

        if action == 'update_current_reading':
            book_id = data.get('book_id')
            
            # Delete all related posts
            PostVotes.query.filter(PostVotes.post_id.in_(
                db.session.query(Post.id).filter_by(book_club_id=club_id)
            )).delete(synchronize_session='fetch')
            Post.query.filter_by(book_club_id=club_id).delete()

            current_reading = CurrentReading.query.filter_by(book_club_id=club_id).first()
            if current_reading:
                current_reading.book_id = book_id
            else:
                new_current_reading = CurrentReading(book_club_id=club_id, book_id=book_id)
                db.session.add(new_current_reading)
            db.session.commit()
            return {"message": "Current reading updated successfully"}, 200

        if action == 'remove_member':
            member_id = data.get('member_id')
            membership = Membership.query.filter_by(user_id=member_id, book_club_id=club_id).first()
            if membership:
                db.session.delete(membership)
                db.session.commit()
                return {"message": "Member removed successfully"}, 200

        if action == 'update_genres':
            genre_ids = data.get('genre_ids', [])
            book_club.genres = [Genre.query.get(genre_id) for genre_id in genre_ids]
            db.session.commit()
            return {"message": "Genres updated successfully"}, 200

        return {"message": "Invalid action"}, 400

    @jwt_required()
    def delete(self, club_id):
        try:
            book_club = BookClub.query.get_or_404(club_id)
            
            if book_club.current_reading:
                db.session.delete(book_club.current_reading)
            Membership.query.filter_by(book_club_id=club_id).delete()
            PostVotes.query.filter(PostVotes.post_id.in_(
                db.session.query(Post.id).filter_by(book_club_id=club_id)
            )).delete(synchronize_session='fetch')
            Post.query.filter_by(book_club_id=club_id).delete()
            book_club.genres.clear()
            db.session.delete(book_club)
            db.session.commit()
            return {"message": "Book club deleted successfully"}, 200
        
        except Exception as e:
            print(f"Error deleting book club: {e}")
            return {"message": "Error deleting book club"}, 500

api.add_resource(ManageClub, '/manage-club/<int:club_id>')


if __name__ == "__main__":
    app.run(debug=True)