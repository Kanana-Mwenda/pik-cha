from server.config import db
from datetime import datetime
from uuid import uuid4

def generate_uuid():
    return str(uuid4())

class Image(db.Model):
    __tablename__ = 'images'

    id = db.Column(db.String, primary_key=True, default=generate_uuid)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    filename = db.Column(db.String, nullable=False)
    original_url = db.Column(db.String, nullable=False)
    transformed_url = db.Column(db.String)
    transformation_type = db.Column(db.String)  # e.g., 'resize', 'crop'
    image_metadata = db.Column(db.JSON)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
