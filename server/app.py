from flask import Flask
from server.extensions import db, migrate  # Fixed import

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///pik-cha.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = 'your-secret-key'

    # Initialize extensions first
    db.init_app(app)
    migrate.init_app(app, db)

    # Import and register blueprints AFTER db initialization
    from server.routes.auth import auth_bp
    app.register_blueprint(auth_bp, url_prefix='/auth')

    return app