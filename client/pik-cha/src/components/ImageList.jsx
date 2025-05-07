import React, { useState } from 'react';
import { useImages } from '../store/ImageContext';
import TransformModal from './TransformModal';
import toast from 'react-hot-toast';

function ImageList() {
  const { images, deleteImage, downloadImage } = useImages();
  const [selectedImage, setSelectedImage] = useState(null);
  const [showTransformModal, setShowTransformModal] = useState(false);

  const handleDelete = async (imageId) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      try {
        await deleteImage(imageId);
        toast.success('Image deleted successfully!');
      } catch (err) {
        toast.error('Failed to delete image: ' + err.message);
      }
    }
  };

  const handleDownload = async (filename) => {
    try {
      await downloadImage(filename);
      toast.success('Image downloaded successfully!');
    } catch (err) {
      toast.error('Failed to download image: ' + err.message);
    }
  };

  if (!images.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        No images uploaded yet. Upload your first image above!
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {images.map((image) => (
        <div key={image.id} className="bg-white rounded-lg shadow overflow-hidden">
          <div className="relative aspect-square">
            <img
              src={image.transformed_url || image.original_url}
              alt={image.filename}
              className="w-full h-full object-cover"
            />
            {image.transformation_type && (
              <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded text-sm">
                {image.transformation_type}
              </div>
            )}
          </div>

          <div className="p-4 space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="font-medium truncate">{image.filename}</h3>
              <span className="text-sm text-gray-500">
                {new Date(image.created_at).toLocaleDateString()}
              </span>
            </div>

            {image.image_metadata && (
              <div className="text-sm text-gray-500">
                <p>Size: {image.image_metadata.size?.[0]}x{image.image_metadata.size?.[1]}</p>
                <p>Format: {image.image_metadata.format}</p>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  setSelectedImage(image);
                  setShowTransformModal(true);
                }}
                className="flex-1 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
              >
                Transform
              </button>
              <button
                onClick={() => handleDownload(image.filename)}
                className="flex-1 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
              >
                Download
              </button>
              <button
                onClick={() => handleDelete(image.id)}
                className="flex-1 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}

      {showTransformModal && selectedImage && (
        <TransformModal
          imageId={selectedImage.id}
          onClose={() => {
            setShowTransformModal(false);
            setSelectedImage(null);
          }}
        />
      )}
    </div>
  );
}

export default ImageList;