from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from server.models.image import Image

class ImageSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Image
        load_instance = True
        include_fk = True
        include_relationships = False  # Avoid circular references if not needed
        fields = (
            "id", "user_id", "filename", "original_url",
            "transformed_url", "transformation_type",
            "image_metadata", "created_at"
        )
    

image_schema = ImageSchema()
images_schema = ImageSchema(many=True)
