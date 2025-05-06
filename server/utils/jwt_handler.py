from flask import current_app
import jwt
from datetime import datetime, timedelta

def generate_token(user_id):
    secret_key = current_app.config.get("SECRET_KEY", "supersecret")
    payload = {
        "user_id": user_id,
        "exp": datetime.utcnow() + timedelta(days=1)
    }
    return jwt.encode(payload, secret_key, algorithm="HS256")

def decode_token(token):
    secret_key = current_app.config.get("SECRET_KEY", "supersecret")
    try:
        payload = jwt.decode(token, secret_key, algorithms=["HS256"])
        return payload["user_id"]
    except jwt.ExpiredSignatureError:
        return None
