from flask import current_app
import jwt
from datetime import datetime, timedelta

def generate_token(user_id):
    secret_key = current_app.config.get("JWT_SECRET_KEY", "pikcha-jwt-secret-key-2024")
    expires_delta = current_app.config.get("JWT_ACCESS_TOKEN_EXPIRES", timedelta(days=7))
    payload = {
        "user_id": user_id,
        "exp": datetime.utcnow() + expires_delta,
        "iat": datetime.utcnow()
    }
    return jwt.encode(payload, secret_key, algorithm="HS256")

def decode_token(token):
    secret_key = current_app.config.get("JWT_SECRET_KEY", "pikcha-jwt-secret-key-2024")
    try:
        payload = jwt.decode(token, secret_key, algorithms=["HS256"])
        return payload["user_id"]
    except jwt.ExpiredSignatureError:
        print("Token has expired")
        return None
    except jwt.InvalidTokenError as e:
        print(f"Invalid token: {str(e)}")
        return None
    except Exception as e:
        print(f"Error decoding token: {str(e)}")
        return None
