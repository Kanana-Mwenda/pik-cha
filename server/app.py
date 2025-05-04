from flask import Flask
import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flasgger import Swagger


def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///pikcha.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = 'super-secret-key'  
    app.config['JWT_SECRET_KEY'] = 'jwt-secret-key'  
    app.config['CLOUDINARY_CLOUD_NAME'] = 'your-cloudinary-cloud-name'
    app.config['CLOUDINARY_API_KEY'] = 'your-cloudinary-api-key'
    app.config['CLOUDINARY_API_SECRET'] = 'your-cloudinary-api-secret'
    app.config['SENDGRID_API_KEY'] = 'your-sendgrid-api-key'
    app.config['SWAGGER'] = {
        'title': 'Pik-Cha API',
        'uiversion': 3
    }

    db = SQLAlchemy()
    migrate = Migrate()
    db.init_app(app)
    migrate.init_app(app, db)
    CORS(app)
    Swagger(app)

    from server.routes.auth import auth_bp
    from server.routes.image import image_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(image_bp, url_prefix='/api/images')

    return app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True)
