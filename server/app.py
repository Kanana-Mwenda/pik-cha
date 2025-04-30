from server.config import app, api, db
from server.routes.image import ImageUploadResource, ImageListResource
from server.routes.user import UserResource, UserListResource
from server.routes.auth import SignupResource, LoginResource, MeResource

# Image routes
api.add_resource(ImageUploadResource, '/api/images/upload')
api.add_resource(ImageListResource, '/api/images')

# User routes
api.add_resource(UserListResource, '/api/users')  
api.add_resource(UserResource, '/api/users/<int:id>')

# Auth routes
api.add_resource(SignupResource, '/api/auth/signup')
api.add_resource(LoginResource, '/api/auth/login')
api.add_resource(MeResource, '/api/auth/me')

if __name__ == '__main__':
    app.run(debug=True)
