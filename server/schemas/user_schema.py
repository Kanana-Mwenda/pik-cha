from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from marshmallow import fields, validate
from server.models.user import User

class UserSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = User
        load_instance = True  # This allows deserializing back to model instances

    id = fields.Int(dump_only=True)
    username = fields.Str(required=True, validate=validate.Length(min=3, max=50))
    email = fields.Email(required=True)
    password = fields.Str(load_only=True, required=True, validate=validate.Length(min=6))
    is_verified = fields.Boolean()
    created_at = fields.DateTime(dump_only=True, format="%Y-%m-%d %H:%M:%S")

# Instantiate schemas
user_schema = UserSchema()
users_schema = UserSchema(many=True)
