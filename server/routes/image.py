from flask import Blueprint, request, send_from_directory, current_app as app
from flask_restful import Api, Resource
from werkzeug.utils import secure_filename
from PIL import Image as PILImage
from PIL import UnidentifiedImageError
from rembg import remove

import os
import uuid
from io import BytesIO

from server.config import db
from server.models.image import Image
from server.models.user import User
from server.schemas.image_schema import ImageSchema
from server.utils.jwt_handler import decode_token

# Define the Blueprint
image_bp = Blueprint("image", __name__)
api = Api(image_bp)

# Schemas
image_schema = ImageSchema()
images_schema = ImageSchema(many=True)

# Allowed file extensions
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif"}


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


class UploadImageResource(Resource):
    def post(self):
        auth_header = request.headers.get("Authorization")
        if not auth_header:
            return {"error": "Authorization header required"}, 401

        try:
            token = auth_header.split(" ")[1]
            user_id = decode_token(token)
            user = db.session.get(User, user_id)
            if not user:
                return {"error": "User not found"}, 404

            if "image" not in request.files:
                return {"error": "No image part in the request. Please check the form key."}, 400

            file = request.files["image"]
            if file.filename == "":
                return {"error": "No file selected"}, 400

            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                unique_name = f"{uuid.uuid4().hex}_{filename}"
                filepath = os.path.join(app.config["UPLOAD_FOLDER"], unique_name)

                file.save(filepath)

                try:
                    pil_image = PILImage.open(filepath)
                    pil_image.verify()  # Verify that the file is a valid image
                except UnidentifiedImageError:
                    os.remove(filepath)  # Remove invalid file
                    return {"error": "Uploaded file is not a valid image"}, 400

                pil_image = PILImage.open(filepath)  # Reopen the image after verification
                metadata = {
                    "format": pil_image.format,
                    "mode": pil_image.mode,
                    "size": pil_image.size,
                }

                new_image = Image(
                    user_id=user.id,
                    filename=unique_name,
                    original_url=f"/uploads/{unique_name}",
                    image_metadata=metadata,
                )

                db.session.add(new_image)
                db.session.commit()

                return image_schema.dump(new_image), 201

            return {"error": "Invalid file type"}, 400

        except Exception as e:
            return {"error": f"An error occurred: {str(e)}"}, 400


class ListImagesResource(Resource):
    def get(self):
        auth_header = request.headers.get("Authorization")
        if not auth_header:
            return {"error": "Authorization header required"}, 401

        try:
            token = auth_header.split(" ")[1]
            user_id = decode_token(token)

            user = User.query.get(user_id)
            if not user:
                return {"error": "User not found"}, 404

            images = Image.query.filter_by(user_id=user.id).all()
            return images_schema.dump(images), 200

        except Exception as e:
            return {"error": str(e)}, 400


class TransformImageResource(Resource):
    def post(self, image_id):
        auth_header = request.headers.get("Authorization")
        if not auth_header:
            return {"error": "Authorization header required"}, 401

        try:
            token = auth_header.split(" ")[1]
            user_id = decode_token(token)
            user = db.session.get(User, user_id)
            if not user:
                return {"error": "User not found"}, 404

            # Retrieve the image using db.session.get()
            image = db.session.get(Image, image_id)
            if not image or image.user_id != user.id:
                return {"error": "Image not found or unauthorized"}, 404

            data = request.get_json()
            print('Transform endpoint received data:', data, flush=True)  # Debug print
            transformation = data.get("type")
            options = data.get("options", {})

            original_path = os.path.join(app.config["UPLOAD_FOLDER"], image.filename)
            pil_image = PILImage.open(original_path)

            metadata = image.image_metadata or {}

            if transformation == "resize":
                width = int(options.get("width", pil_image.width))
                height = int(options.get("height", pil_image.height))
                pil_image = pil_image.resize((width, height))
                metadata.update({"width": width, "height": height})

            elif transformation == "crop":
                left = int(options.get("left", 0))
                top = int(options.get("top", 0))
                right = int(options.get("right", pil_image.width))
                bottom = int(options.get("bottom", pil_image.height))
                pil_image = pil_image.crop((left, top, right, bottom))
                metadata.update({"crop_box": [left, top, right, bottom]})

            elif transformation == "rotate":
                angle = int(options.get("angle", 0))
                pil_image = pil_image.rotate(angle, expand=True)
                metadata.update({"rotation_angle": angle})

            elif transformation == "watermark":
                from PIL import ImageDraw, ImageFont
                draw = ImageDraw.Draw(pil_image)
                font = ImageFont.load_default()
                text = options.get("text", "Pik-Cha")
                draw.text((10, 10), text, fill="white", font=font)
                metadata.update({"watermark": text})

            elif transformation == "flip":
                from PIL import ImageOps
                pil_image = ImageOps.flip(pil_image)
                metadata.update({"flipped": True})

            elif transformation == "mirror":
                from PIL import ImageOps
                pil_image = ImageOps.mirror(pil_image)
                metadata.update({"mirrored": True})

            elif transformation == "compress":
                quality = int(options.get("quality", 75))
                metadata.update({"compressed_quality": quality})

            elif transformation == "format":
                fmt = options.get("format", "JPEG").upper()
                metadata.update({"format": fmt})
                ext = fmt.lower()
                if ext == "jpeg":
                    ext = "jpg"
                # Convert to RGB if saving as JPEG/JPG
                if ext in ["jpeg", "jpg"]:
                    pil_image = pil_image.convert("RGB")

            elif transformation == "filter":
                from PIL import ImageOps
                filter_type = options.get("filter")
                if filter_type == "grayscale":
                    pil_image = ImageOps.grayscale(pil_image)
                elif filter_type == "sepia":
                    sepia = pil_image.convert("RGB")
                    pixels = sepia.load()
                    for y in range(sepia.height):
                        for x in range(sepia.width):
                            r, g, b = pixels[x, y]
                            tr = int(0.393 * r + 0.769 * g + 0.189 * b)
                            tg = int(0.349 * r + 0.686 * g + 0.168 * b)
                            tb = int(0.272 * r + 0.534 * g + 0.131 * b)
                            pixels[x, y] = (min(255, tr), min(255, tg), min(255, tb))
                    pil_image = sepia
                metadata.update({"filter": filter_type})

            elif transformation == "remove_bg":
                img_bytes = BytesIO()
                pil_image.save(img_bytes, format="PNG")
                output_bytes = remove(img_bytes.getvalue())
                pil_image = PILImage.open(BytesIO(output_bytes)).convert("RGBA")
                metadata.update({"background_removed": True})

            else:
                return {"error": f"Unsupported transformation type: {transformation}"}, 400

            # --- Crop validation ---
            if transformation == "crop":
                left = options.get("left")
                top = options.get("top")
                right = options.get("right")
                bottom = options.get("bottom")
                width, height = pil_image.size
                if not (0 <= left < right <= width and 0 <= top < bottom <= height):
                    return {"error": f"Crop box must be within image bounds (0,0,{width},{height}) and left < right, top < bottom."}, 400

            # --- Resize validation ---
            if transformation == "resize":
                width_opt = options.get("width")
                height_opt = options.get("height")
                if not (width_opt > 0 and height_opt > 0):
                    return {"error": "Width and height must be positive numbers."}, 400

            # --- Rotate validation ---
            if transformation == "rotate":
                angle = options.get("angle")
                if angle is None or not isinstance(angle, (int, float)):
                    return {"error": "Angle must be a number."}, 400

            ext = "png" if transformation == "remove_bg" else (ext if transformation == "format" else "jpg")
            new_filename = f"{image.id}_{transformation}.{ext}"
            transformed_path = os.path.join(app.config["UPLOAD_FOLDER"], new_filename)

            pil_image.save(transformed_path, quality=options.get("quality", 95))

            image.transformed_url = f"/uploads/{new_filename}"
            image.transformation_type = transformation
            image.image_metadata = metadata

            db.session.commit()

            return image_schema.dump(image), 200

        except Exception as e:
            return {"error": str(e)}, 400


class DownloadImageResource(Resource):
    def get(self, filename):
        try:
            return send_from_directory(app.config["UPLOAD_FOLDER"], filename, as_attachment=True)
        except FileNotFoundError:
            return {"error": "File not found"}, 404
        
class ImageDetailResource(Resource):
    def get(self, image_id):
        auth_header = request.headers.get("Authorization")
        if not auth_header:
            return {"error": "Authorization header required"}, 401

        try:
            token = auth_header.split(" ")[1]
            user_id = decode_token(token)

            image = Image.query.get(image_id)
            if not image or image.user_id != user_id:
                return {"error": "Image not found or unauthorized"}, 404

            return image_schema.dump(image), 200
        except Exception as e:
            return {"error": str(e)}, 400

    def patch(self, image_id):
        auth_header = request.headers.get("Authorization")
        if not auth_header:
            return {"error": "Authorization header required"}, 401

        try:
            token = auth_header.split(" ")[1]
            user_id = decode_token(token)

            image = Image.query.get(image_id)
            if not image or image.user_id != user_id:
                return {"error": "Image not found or unauthorized"}, 404

            data = request.get_json()
            transformation_type = data.get("transformation_type")
            image_metadata = data.get("image_metadata")

            if transformation_type:
                image.transformation_type = transformation_type
            if image_metadata:
                image.image_metadata = image_metadata

            db.session.commit()
            return image_schema.dump(image), 200
        except Exception as e:
            return {"error": str(e)}, 400

    def delete(self, image_id):
        auth_header = request.headers.get("Authorization")
        if not auth_header:
            return {"error": "Authorization header required"}, 401

        try:
            token = auth_header.split(" ")[1]
            user_id = decode_token(token)

            # Retrieve the image using db.session.get()
            image = db.session.get(Image, image_id)
            if not image or image.user_id != user_id:
                return {"error": "Image not found or unauthorized"}, 404

            # Delete physical files
            for url_field in [image.original_url, image.transformed_url]:
                if url_field:
                    filepath = os.path.join(app.config["UPLOAD_FOLDER"], os.path.basename(url_field))
                    if os.path.exists(filepath):
                        os.remove(filepath)

            db.session.delete(image)
            db.session.commit()

            return {"message": "Image deleted successfully."}, 200
        except Exception as e:
            return {"error": str(e)}, 400

@image_bp.route('/uploads/<filename>')
def serve_uploaded_file(filename):
    return send_from_directory(current_app.config["UPLOAD_FOLDER"], filename)

# Add resources to the Blueprint
api.add_resource(UploadImageResource, "/")
api.add_resource(ListImagesResource, "/")
api.add_resource(TransformImageResource, "/<string:image_id>/transform")
api.add_resource(DownloadImageResource, "/download/<string:filename>")
api.add_resource(ImageDetailResource, "/<string:image_id>")
