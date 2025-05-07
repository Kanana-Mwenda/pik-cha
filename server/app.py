from server.config import create_app, db, api
from server.routes.user import UserResource, UserListResource, user_bp
from server.routes.auth import SignupResource, LoginResource, MeResource, auth_bp
from server.routes.image import UploadImageResource, ListImagesResource, TransformImageResource, DownloadImageResource, ImageDetailResource, image_bp
from flask_jwt_extended import JWTManager
import os
from flask import send_from_directory, current_app

# Create app instance
app = create_app()

# Configure JWT
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'pikcha-jwt-secret-key-2024')
jwt = JWTManager(app)

# Register blueprints
app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(image_bp, url_prefix="/api/images")
app.register_blueprint(user_bp, url_prefix="/api/users")

@app.route('/uploads/<filename>')
def serve_uploaded_file(filename):
    return send_from_directory(current_app.config["UPLOAD_FOLDER"], filename)

if __name__ == '__main__':
    app.run(debug=True)
