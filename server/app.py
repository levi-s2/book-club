from flask import Flask, jsonify, make_response
from flask_migrate import Migrate
from flask_cors import CORS
from flask_restful import Api, Resource
from flask_jwt_extended import JWTManager
from models import db, bcrypt, Book
from datetime import timedelta
import os

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

api.add_resource(Books, '/books')

if __name__ == "__main__":
    app.run(debug=True)
