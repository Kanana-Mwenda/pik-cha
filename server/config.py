import os
from datetime import timedelta
from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from flask_restful import Api
from flask_jwt_extended import JWTManager
from sqlalchemy import MetaData
from dotenv import load_dotenv
from sqlalchemy.ext.declarative import declarative_base

# Load environment variables from .env
load_dotenv()

# Instantiate Flask app
app = Flask(__name__)

# CORS configuration
CORS(app, supports_credentials=True)

# RESTful API
api = Api(app)

# JWT setup
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "super-secret-jwt-key")
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(days=7)
jwt = JWTManager(app)

# Secret key
app.secret_key = os.getenv("FLASK_SECRET_KEY", "supersecretkey")

# Session config
app.config["SESSION_TYPE"] = "filesystem"
app.config["PERMANENT_SESSION_LIFETIME"] = timedelta(days=7)

# Database configuration from .env
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv(
    "DATABASE_URL", "postgresql://pikcha_user:alenga123@localhost:5432/pikcha_db"
)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# JSON settings
app.json.compact = False

# SQLAlchemy setup
metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})
Base = declarative_base(metadata=metadata)
db = SQLAlchemy(app, model_class=Base)

# Migrations
migrate = Migrate(app, db)
