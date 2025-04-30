from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from server.models.image import Image

class ImageSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Image
        load_instance = True
        include_fk = True
