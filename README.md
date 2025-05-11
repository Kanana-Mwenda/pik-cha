# pik-cha
Pik-Cha is an image editing app that enables users to upload, transform and retrieve images in various formats. Inspired by Cloudinary, this service provides a comprehensive set of image manipulation features with secure user authentication.

## Features

### User Authentication
Sign-Up: Create your account with email and password
Log-In: Secure access to your dashboard
JWT Authentication: All endpoints are protected using JWT tokens

### Image Management

Upload Images: Support for various image formats (JPEG, PNG, GIF, etc.)
Transform Images: Apply various transformations to your images
Retrieve Images: Get images in different formats and sizes
List Images: Browse all your uploaded images in the gallery

### Image Transformations

-Resize: Change dimensions while maintaining or ignoring aspect ratio
-Crop: Select specific portions of images
-Rotate: Rotate images by specific angles
-Watermark: Add text or image watermarks
-Flip: Flip images horizontally or vertically
-Mirror: Create mirror images
-Format Conversion: Convert between JPEG, PNG, WebP, and more
-Filters: Apply visual filters (grayscale, sepia etc).
-AI Background Removal: Automatically detect and remove image backgrounds
-Drag-and-Drop Upload: User-friendly interface for easy uploads
-Preview & Download: Preview transformations and download processed images

## Installation

-Clone the repository:

git clone https://github.com/yourusername/pik-cha.git
cd pik-cha

-Install dependencies:
cd client
npm install

cd server
pipenv install && pipenv shell
pip install -r requirements.txt

-Start the development server:
cd server
flask run

cd client
npm run dev

## Technologies used
### Front-end
-HTML CSS Tailwind
-React

### Back-end
-Python
-Flask
-PostgreSQL

## Contributing
-Fork the repository
-Create your feature branch (git checkout -b feature/amazing-feature)
-Commit your changes (git commit -m 'Add some amazing feature')
-Push to the branch (git push origin feature/amazing-feature)
-Open a Pull Request
