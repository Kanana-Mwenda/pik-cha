from marshmallow import Schema, fields, validates, ValidationError

class UserSchema(Schema):
    username = fields.Str(required=True)
    email = fields.Email(required=True)
    password = fields.Str(required=True)

    @validates('email')
    def validate_email(self, value):
        if len(value) < 5:
            raise ValidationError("Email must be at least 5 characters.")
