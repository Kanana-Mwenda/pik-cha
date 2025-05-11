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
                    is_transformed=False,
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
        if not auth_header or not auth_header.startswith('Bearer '):
            print("Invalid Authorization header:", auth_header)
            return {"error": "Invalid Authorization header"}, 401

        try:
            token = auth_header.split(" ")[1]
            user_id = decode_token(token)
            if not user_id:
                print("Invalid token or user_id not found")
                return {"error": "Invalid token"}, 401

            print(f"Fetching images for user_id: {user_id}")
            user = User.query.get(user_id)
            if not user:
                print(f"User not found for user_id: {user_id}")
                return {"error": "User not found"}, 404

            images = Image.query.filter_by(user_id=user_id, is_transformed=True).all()
            print(f"Found {len(images)} images for user {user_id}")
            
            serialized_images = []
            for img in images:
                try:
                    img_dict = image_schema.dump(img)
                    # Add file size in bytes
                    filepath = os.path.join(app.config["UPLOAD_FOLDER"], img.filename)
                    if os.path.exists(filepath):
                        img_dict["size"] = os.path.getsize(filepath)
                        print(f"Image {img.filename} size: {img_dict['size']} bytes")
                    else:
                        print(f"Warning: Image file not found: {filepath}")
                        img_dict["size"] = 0
                    
                    # Count transformations from metadata
                    transformations = 0
                    if img.image_metadata:
                        transformations = sum(1 for k in img.image_metadata.keys() if k in [
                            "width", "height", "crop_box", "rotation_angle", 
                            "watermark", "flipped", "mirrored", "compressed_quality", 
                            "format", "filter", "background_removed"
                        ])
                    img_dict["transformations"] = transformations
                    print(f"Image {img.filename} transformations: {transformations}")
                    
                    serialized_images.append(img_dict)
                except Exception as e:
                    print(f"Error processing image {img.filename}: {str(e)}")
                    continue
            
            print(f"Returning {len(serialized_images)} serialized images")
            print("Serialized images:", serialized_images, flush=True)
            return serialized_images, 200

        except Exception as e:
            print(f"Error in ListImagesResource: {str(e)}")
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
            transformations = data.get("transformations", [])  # Expecting a list of transformations

            if not transformations:
                return {"error": "No transformations provided"}, 400

            original_path = os.path.join(app.config["UPLOAD_FOLDER"], image.filename)
            pil_image = PILImage.open(original_path)

            metadata = image.image_metadata or {}

            # Apply each transformation in sequence
            for transformation in transformations:
                type = transformation.get("type")
                options = transformation.get("options", {})

                if type == "resize":
                    width = int(options.get("width", pil_image.width))
                    height = int(options.get("height", pil_image.height))
                    pil_image = pil_image.resize((width, height))
                    metadata.update({"width": width, "height": height})

                elif type == "crop":
                    left = int(options.get("left", 0))
                    top = int(options.get("top", 0))
                    right = int(options.get("right", pil_image.width))
                    bottom = int(options.get("bottom", pil_image.height))
                    pil_image = pil_image.crop((left, top, right, bottom))
                    metadata.update({"crop_box": [left, top, right, bottom]})

                elif type == "rotate":
                    angle = int(options.get("angle", 0))
                    pil_image = pil_image.rotate(angle, expand=True)
                    metadata.update({"rotation_angle": angle})

                elif type == "watermark":
                    from PIL import ImageDraw, ImageFont
                    draw = ImageDraw.Draw(pil_image)
                    font = ImageFont.load_default()
                    text = options.get("text", "Pik-Cha")
                    draw.text((10, 10), text, fill="white", font=font)
                    metadata.update({"watermark": text})

                elif type == "flip":
                    from PIL import ImageOps
                    pil_image = ImageOps.flip(pil_image)
                    metadata.update({"flipped": True})

                elif type == "mirror":
                    from PIL import ImageOps
                    pil_image = ImageOps.mirror(pil_image)
                    metadata.update({"mirrored": True})

                elif type == "compress":
                    quality = int(options.get("quality", 75))
                    metadata.update({"compressed_quality": quality})

                elif type == "format":
                    fmt = options.get("format", "JPEG").upper()
                    metadata.update({"format": fmt})
                    ext = fmt.lower()
                    if ext == "jpeg":
                        ext = "jpg"
                    # Convert to RGB if saving as JPEG/JPG
                    if ext in ["jpeg", "jpg"]:
                        pil_image = pil_image.convert("RGB")

                elif type == "filter":
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

                elif type == "remove_bg":
                    img_bytes = BytesIO()
                    pil_image.save(img_bytes, format="PNG")
                    output_bytes = remove(img_bytes.getvalue())
                    pil_image = PILImage.open(BytesIO(output_bytes)).convert("RGBA")
                    metadata.update({"background_removed": True})

                else:
                    return {"error": f"Unsupported transformation type: {type}"}, 400

            # Save the final transformed image
            ext = "png" if "remove_bg" in [t["type"] for t in transformations] else "jpg"
            new_filename = f"{image.id}_transformed.{ext}"
            transformed_path = os.path.join(app.config["UPLOAD_FOLDER"], new_filename)

            print(f"Saving image: mode={pil_image.mode}, size={pil_image.size}, ext={ext}", flush=True)
            if ext in ["jpeg", "jpg"] and pil_image.mode != "RGB":
                pil_image = pil_image.convert("RGB")
            try:
                pil_image.save(transformed_path, quality=options.get("quality", 95))
            except Exception as e:
                print(f"Save error: {e}", flush=True)
                return {"error": str(e)}, 400

            if not os.path.exists(transformed_path):
                print(f"Error: Transformed file not found at {transformed_path}", flush=True)

            new_image = Image(
                user_id=user.id,
                filename=new_filename,
                original_url=image.original_url,  # Keep the original image's URL
                transformed_url=f"/uploads/{new_filename}",  # Ensure this matches the actual file path
                transformation_type="multiple",  # Indicate multiple transformations
                image_metadata=metadata,
                is_transformed=True,
            )
            db.session.add(new_image)
            db.session.commit()

            return image_schema.dump(new_image), 201

        except Exception as e:
            return {"error": str(e)}, 400


class DownloadImageResource(Resource):
    def get(self, filename):
        try:
            return send_from_directory(app.config["UPLOAD_FOLDER"], filename, as_attachment=False)
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
