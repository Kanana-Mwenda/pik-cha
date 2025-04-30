# Inside server/routes/auth.py
from flask import Blueprint, request, jsonify
from server.models.user import User  # Changed import
from server.utils.jwt_handler import create_access_token  # Changed import
from server.extensions import db  # Changed import

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()

        # Log the request data
        print(f"Signup data received: {data}")  # Log received data

        username = data.get('username')
        email = data.get('email')
        password = data.get('password')

        if not username or not email or not password:
            return jsonify({"message": "Missing required fields"}), 400

        if User.query.filter_by(email=email).first():
            return jsonify({"message": "User already exists"}), 400

        new_user = User(username=username, email=email, password=password)
        db.session.add(new_user)
        db.session.commit()

        print(f"User created with ID: {new_user.id}")  # Log the user ID after commit
        return jsonify({"message": "User created successfully!"}), 201

    except Exception as e:
        print(f"Error during signup: {e}")  # Log the error
        return jsonify({"message": "Internal Server Error"}), 500


@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        print(f"Login data received: {data}")  # Print received data for debugging

        user = User.query.filter_by(email=email).first()
        if user and user.check_password(password):
            access_token = create_access_token(user.id)
            print(f"Access token generated for user: {user.id}")  # Log token generation
            return jsonify({"access_token": access_token}), 200

        return jsonify({"message": "Invalid email or password"}), 401
    except Exception as e:
        print(f"Error during login: {e}")  # Log the error
        return jsonify({"message": "Internal Server Error"}), 500