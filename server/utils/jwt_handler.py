from flask import current_app
import jwt
from datetime import datetime, timedelta

def generate_token(user_id):
    secret_key = current_app.config.get("JWT_SECRET_KEY", "pikcha-jwt-secret-key-2024")
    payload = {
        "user_id": user_id,
        "exp": datetime.utcnow() + timedelta(days=1)
    }
    return jwt.encode(payload, secret_key, algorithm="HS256")

def decode_token(token):
    secret_key = current_app.config.get("JWT_SECRET_KEY", "pikcha-jwt-secret-key-2024")
    try:
        payload = jwt.decode(token, secret_key, algorithms=["HS256"])
        return payload["user_id"]
    except jwt.ExpiredSignatureError:
        return None
