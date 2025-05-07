from flask import Blueprint, request
from flask_restful import Api, Resource
from server.models.user import User
from server.schemas.user_schema import UserSchema
from server.config import db
from server.utils.jwt_handler import generate_token, decode_token

# Define the Blueprint
auth_bp = Blueprint("auth", __name__)
api = Api(auth_bp)

user_schema = UserSchema()

class SignupResource(Resource):
    def post(self):
        data = request.get_json()
        email = data.get("email")
        username = data.get("username")
        password = data.get("password")

        if User.query.filter((User.email == email) | (User.username == username)).first():
            return {"error": "Email or username already in use."}, 400

        user = User(email=email, username=username)
        user.set_password(password)

        db.session.add(user)
        db.session.commit()

        access_token = generate_token(user.id)

        return {
            "message": "User created successfully",
            "user": user_schema.dump(user),
            "access_token": access_token
        }, 201

class LoginResource(Resource):
    def post(self):
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")

        user = User.query.filter_by(email=email).first()
        if not user or not user.check_password(password):
            return {"error": "Invalid email or password"}, 401

        access_token = generate_token(user.id)

        return {
            "message": "Login successful",
            "user": user_schema.dump(user),
            "access_token": access_token
        }, 200

class MeResource(Resource):
    def get(self):
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith('Bearer '):
            print("Invalid Authorization header:", auth_header)
            return {"error": "Authorization header required"}, 401

        try:
            token = auth_header.split(" ")[1]
            print("Validating token...")
            user_id = decode_token(token)
            
            if not user_id:
                print("Token validation failed")
                return {"error": "Invalid or expired token"}, 401

            print(f"Token validated for user_id: {user_id}")
            user = User.query.get(user_id)
            
            if not user:
                print(f"User not found for user_id: {user_id}")
                return {"error": "User not found"}, 404

            print(f"User found: {user.username}")
            return user_schema.dump(user), 200
            
        except Exception as e:
            print(f"Error in MeResource: {str(e)}")
            return {"error": str(e)}, 401

# Add resources to the Blueprint
api.add_resource(SignupResource, "/signup")
api.add_resource(LoginResource, "/login")
api.add_resource(MeResource, "/me")
