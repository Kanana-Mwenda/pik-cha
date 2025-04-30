# server/routes/user.py

from flask import request, jsonify
from flask_restful import Resource
from server.models.user import User
from server.schemas.user_schema import user_schema, users_schema
from server.extensions import db
from werkzeug.security import generate_password_hash

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
        user = User.query.get_or_404(id)
        return user_schema.dump(user), 200

    def put(self, id):
        user = User.query.get_or_404(id)
        data = request.get_json()

        user.username = data.get('username', user.username)
        user.email = data.get('email', user.email)
        if 'password' in data:
            user.password = generate_password_hash(data['password'])

        db.session.commit()
        return user_schema.dump(user), 200

    def delete(self, id):
        user = User.query.get_or_404(id)
        db.session.delete(user)
        db.session.commit()
        return {"message": "User deleted successfully."}, 204
