from flask_restful import Resource, reqparse
from flask import request
from server.models.image import Image
from server.schemas.image_schema import ImageSchema
from server.config import db
from flask_jwt_extended import jwt_required, get_jwt_identity

image_schema = ImageSchema()
image_list_schema = ImageSchema(many=True)

class ImageUploadResource(Resource):
    @jwt_required()
    def post(self):
        user_id = get_jwt_identity()
        if 'file' not in request.files:
            return {"error": "No file provided"}, 400
        
        file = request.files['file']
        if file.filename == '':
            return {"error": "No selected file"}, 400

        # Simulate upload logic — this will be replaced by Cloudinary later
        fake_url = f"https://fakestorage.com/{file.filename}"

        image = Image(
            user_id=user_id,
            filename=file.filename,
            original_url=fake_url
        )

        db.session.add(image)
        db.session.commit()

        return image_schema.dump(image), 201

class ImageListResource(Resource):
    @jwt_required()
    def get(self):
        user_id = get_jwt_identity()
        images = Image.query.filter_by(user_id=user_id).all()
        return image_list_schema.dump(images), 200
