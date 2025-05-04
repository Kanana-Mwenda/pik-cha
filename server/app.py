from server.config import create_app, db, api
from server.routes.user import UserResource, UserListResource
from server.routes.auth import SignupResource, LoginResource, MeResource
from server.routes.image import UploadImageResource, ListImagesResource, TransformImageResource, DownloadImageResource, ImageDetailResource

# Create app instance
app = create_app()

# User routes
api.add_resource(UserListResource, '/api/users')  
api.add_resource(UserResource, '/api/users/<int:id>')

# Auth routes
api.add_resource(SignupResource, '/api/auth/signup')
api.add_resource(LoginResource, '/api/auth/login')
api.add_resource(MeResource, '/api/auth/me')

# Image routes
api.add_resource(UploadImageResource, "/api/images/upload")
api.add_resource(ListImagesResource, "/api/images")
api.add_resource(TransformImageResource, "/api/images/<string:image_id>/transform")
api.add_resource(DownloadImageResource, "/api/images/download/<string:filename>")
api.add_resource(ImageDetailResource, "/api/images/<string:image_id>")

if __name__ == '__main__':
    app.run(debug=True)
