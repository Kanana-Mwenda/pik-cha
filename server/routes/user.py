# server/routes/user.py

from flask import Blueprint, request, jsonify
from flask_restful import Api, Resource
from server.models.user import User
from server.schemas.user_schema import UserSchema, user_schema, users_schema
from server.extensions import db
from werkzeug.security import generate_password_hash
from flask_jwt_extended import jwt_required, get_jwt_identity

# Define the Blueprint
user_bp = Blueprint("user", __name__)
api = Api(user_bp)

# Schema
user_schema = UserSchema()

class UserListResource(Resource):
    def get(self):
        users = User.query.all()
        return users_schema.dump(users), 200

    def post(self):
        data = request.get_json()

        if User.query.filter_by(email=data.get('email')).first():
            return {"message": "Email already registered."}, 400

        hashed_password = generate_password_hash(data.get('password'))

        new_user = User(
            username=data.get('username'),
            email=data.get('email'),
            password=hashed_password,
            role=data.get('role', 'user')  # default role
        )
        db.session.add(new_user)
        db.session.commit()

        return user_schema.dump(new_user), 201

class UserResource(Resource):
    def get(self, id):
        user = db.session.get(User, id)
        return user_schema.dump(user), 200

    def put(self, id):
        user = db.session.get(User, id)
        data = request.get_json()

        user.username = data.get('username', user.username)
        user.email = data.get('email', user.email)
        if 'password' in data:
            user.password = generate_password_hash(data['password'])

        db.session.commit()
        return user_schema.dump(user), 200

    def delete(self, id):
        user = db.session.get(User, id)
        db.session.delete(user)
        db.session.commit()
        return {"message": "User deleted successfully."}, 204

class UserProfileResource(Resource):
    @jwt_required()
    def get(self):
        user_id = get_jwt_identity()
        user = db.session.get(User, user_id)
        if not user:
            return {"error": "User not found"}, 404
        return user_schema.dump(user), 200

    @jwt_required()
    def patch(self):
        user_id = get_jwt_identity()
        user = db.session.get(User, user_id)
        if not user:
            return {"error": "User not found"}, 404

        data = request.get_json()
        if "username" in data:
            user.username = data["username"]
        if "email" in data:
            user.email = data["email"]

        db.session.commit()
        return user_schema.dump(user), 200

# Add resources to the Blueprint
api.add_resource(UserListResource, "/")
api.add_resource(UserResource, "/<int:id>")
api.add_resource(UserProfileResource, "/profile")
