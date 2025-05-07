from setuptools import setup, find_packages

setup(
    name="server",
    version="0.1",
    packages=find_packages(),
    install_requires=[
        "flask",
        "flask-sqlalchemy",
        "flask-migrate",
        "flask-jwt-extended",
        "flask-restful",
        "flask-cors",
        "marshmallow-sqlalchemy",
        "python-dotenv",
        "pillow",
        "rembg",
        "pyjwt",
    ],
) 