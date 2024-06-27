from flask import Flask, jsonify, request, make_response
from flask_migrate import Migrate
from flask_cors import CORS
from flask_restful import Api, Resource
from flask_jwt_extended import JWTManager, create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from models import db, bcrypt, User, Book, BookClub, Genre, Membership
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
CORS(app, resources={r"*": {"origins": "*"}})
jwt = JWTManager(app)

class Home(Resource):
    def get(self):
        response_dict = {"message": "Book Club API"}
        response = make_response(jsonify(response_dict), 200)
        return response

api.add_resource(Home, '/')

class Books(Resource):
    def get(self):
        response_dict_list = [book.to_dict() for book in Book.query.all()]
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
            return {"access_token": access_token, "refresh_token": refresh_token}, 200
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
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        return {"username": user.username, "email": user.email}, 200

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

api.add_resource(BookClubs, '/book-clubs', endpoint='book_clubs_endpoint')


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


class CreateBookClub(Resource):
    @jwt_required()
    def post(self):
        try:
            user_id = get_jwt_identity()
            data = request.get_json()
            name = data.get('name')
            description = data.get('description')

            if not name:
                return {"message": "Name is required"}, 400

            new_club = BookClub(name=name, description=description, created_by=user_id)
            db.session.add(new_club)
            db.session.commit()

            return {"message": "Book club created successfully", "club": new_club.to_dict(user_id=user_id)}, 201
        except Exception as e:
            print(f"Error during book club creation: {e}")
            traceback.print_exc()
            return {"message": "Internal Server Error"}, 500

api.add_resource(CreateBookClub, '/create-club')



if __name__ == "__main__":
    app.run(debug=True)
