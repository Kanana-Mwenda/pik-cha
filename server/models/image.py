from server.extensions import db
from datetime import datetime
from uuid import uuid4

def generate_uuid():
    return str(uuid4())

class Image(db.Model):
    __tablename__ = 'images'

    id = db.Column(db.String, primary_key=True, default=generate_uuid)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    filename = db.Column(db.String, nullable=False)  # Original file name
    original_url = db.Column(db.String, nullable=False)  # Path to original
    transformed_url = db.Column(db.String)  # Path to transformed image (if any)
    transformation_type = db.Column(db.String)  # e.g., 'resize', 'crop', etc.
    image_metadata = db.Column(db.JSON)  # e.g., {"width": 300, "height": 200}
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_transformed = db.Column(db.Boolean, default=False)

    def __repr__(self):
        return f"<Image {self.filename} by User {self.user_id}>"
