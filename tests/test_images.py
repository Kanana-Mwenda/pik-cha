import pytest
import json
import os
from io import BytesIO
from PIL import Image as PILImage
from server.models.image import Image
from server.models.user import User
from server.utils.jwt_handler import generate_token
from server.config import db


@pytest.fixture(scope="function")
def test_user(app):
    """Create a fresh user per test."""
    user = User(username="testuser", email="testuser@example.com")
    user.set_password("password")
    db.session.add(user)
    db.session.commit()
    yield user
    db.session.delete(user)
    db.session.commit()


@pytest.fixture(scope="function")
def auth_headers(test_user):
    """Return headers with valid auth token."""
    token = generate_token(test_user.id)
    return {"Authorization": f"Bearer {token}"}


def create_test_image_file(filename="test_image.png"):
    """Create a valid test image file."""
    image = PILImage.new("RGB", (100, 100), color="red")  # Create a 100x100 red image
    image.save(filename)
    return filename


def test_upload_image(client, auth_headers):
    filename = create_test_image_file()
    with open(filename, "rb") as f:
        data = {'image': (BytesIO(f.read()), filename)}
        response = client.post("/api/images/upload", data=data, headers=auth_headers)
    os.remove(filename)

    print(response.json)  # Debugging
    assert response.status_code == 201
    assert "filename" in response.json
    assert response.json["filename"].endswith("test_image.png")  # Check for original filename


def test_list_images(client, auth_headers):
    filename = create_test_image_file()
    with open(filename, "rb") as f:
        data = {'image': (BytesIO(f.read()), filename)}
        client.post("/api/images/upload", data=data, headers=auth_headers)
    os.remove(filename)

    response = client.get("/api/images/", headers=auth_headers)  # Add trailing slash
    print(response.json)  # Debugging
    assert response.status_code == 200
    assert any(img["filename"].endswith("test_image.png") for img in response.json)


def test_transform_image(client, auth_headers):
    filename = create_test_image_file()
    with open(filename, "rb") as f:
        data = {'image': (BytesIO(f.read()), filename)}
        upload_response = client.post("/api/images/upload", data=data, headers=auth_headers)
    os.remove(filename)

    print(upload_response.json)  # Debugging
    image_id = upload_response.json["id"]
    transform_data = {
        "type": "resize",
        "options": {"width": 200, "height": 200}
    }
    response = client.post(
        f"/api/images/{image_id}/transform",
        data=json.dumps(transform_data),
        content_type='application/json',
        headers=auth_headers
    )

    print(response.json)  # Debugging
    assert response.status_code == 200
    assert "transformed_url" in response.json


def test_delete_image(client, auth_headers):
    filename = create_test_image_file()
    with open(filename, "rb") as f:
        data = {'image': (BytesIO(f.read()), filename)}
        upload_response = client.post("/api/images/upload", data=data, headers=auth_headers)
    os.remove(filename)

    print(upload_response.json)  # Debugging
    image_id = upload_response.json["id"]
    response = client.delete(f"/api/images/{image_id}", headers=auth_headers)

    print(response.json)  # Debugging
    assert response.status_code == 200
    assert response.json["message"] == "Image deleted successfully."


def test_unauthorized_upload(client):
    filename = create_test_image_file()
    with open(filename, "rb") as f:
        data = {'image': (BytesIO(f.read()), filename)}
        response = client.post("/api/images/upload", data=data)
    os.remove(filename)

    assert response.status_code == 401
    assert "error" in response.json


def test_invalid_image_type(client, auth_headers):
    filename = "test_invalid.txt"
    with open(filename, "wb") as f:
        f.write(b"not an image")

    with open(filename, "rb") as f:
        data = {'image': (BytesIO(f.read()), filename)}
        response = client.post("/api/images/upload", data=data, headers=auth_headers)
    os.remove(filename)

    assert response.status_code == 400
    assert "error" in response.json

def test_download_image(client, auth_headers):
    filename = create_test_image_file()
    with open(filename, "rb") as f:
        data = {'image': (BytesIO(f.read()), filename)}
        upload_response = client.post("/api/images/upload", data=data, headers=auth_headers)
    os.remove(filename)

    print(upload_response.json)  # Debugging
    unique_filename = upload_response.json["filename"]
    response = client.get(f"/api/images/{unique_filename}/download", headers=auth_headers)

    assert response.status_code == 200
