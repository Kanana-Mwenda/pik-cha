from PIL import Image, ImageOps, ImageEnhance, ImageFilter, ImageDraw, ImageFont
from rembg import remove
import io

def resize_image(image, width, height):
    return image.resize((width, height))

def crop_image(image, left, top, right, bottom):
    return image.crop((left, top, right, bottom))

def rotate_image(image, angle):
    return image.rotate(angle, expand=True)

def flip_image(image):
    return image.transpose(Image.FLIP_TOP_BOTTOM)

def mirror_image(image):
    return image.transpose(Image.FLIP_LEFT_RIGHT)

def compress_image(image, quality=70):
    buf = io.BytesIO()
    image.save(buf, format=image.format, optimize=True, quality=quality)
    buf.seek(0)
    return Image.open(buf)

def convert_format(image, fmt):
    buf = io.BytesIO()
    image.save(buf, format=fmt)
    buf.seek(0)
    return Image.open(buf)

def grayscale_image(image):
    return image.convert("L")

def sepia_image(image):
    grayscale = image.convert("L")
    sepia = ImageOps.colorize(grayscale, "#704214", "#C0A080")
    return sepia

def watermark_image(image, text="Pik-Cha", position=(10, 10), opacity=128):
    watermark = Image.new("RGBA", image.size)
    draw = ImageDraw.Draw(watermark)
    font = ImageFont.load_default()
    draw.text(position, text, fill=(255, 255, 255, opacity), font=font)
    watermarked = Image.alpha_composite(image.convert("RGBA"), watermark)
    return watermarked.convert("RGB")

def remove_background(image):
    buf = io.BytesIO()
    image.save(buf, format="PNG")
    buf.seek(0)
    result = remove(buf.read())
    return Image.open(io.BytesIO(result))
