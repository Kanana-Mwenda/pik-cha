// src/components/ImageUpload.jsx
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useImages } from '../store/ImageContext';
import toast from 'react-hot-toast';
import TransformModal from './TransformModal';

function ImageUpload() {
  const { uploadImage, uploadProgress } = useImages();
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError("Please upload an image file");
      return;
    }

    setError("");
    setPreviewUrl(URL.createObjectURL(file));

    try {
      await uploadImage(file);
      toast.success('Image uploaded successfully!');
      setPreviewUrl(null);
    } catch (err) {
      setError(err.message);
      toast.error('Upload failed: ' + err.message);
    }
  }, [uploadImage]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxFiles: 1
  });

  const handleEdit = () => {
    if (!previewUrl) {
      setError("No image to edit!");
      return;
    }
    setShowModal(true);
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-blue-500">Drop the image here...</p>
        ) : (
          <div className="space-y-2">
            <p className="text-gray-600">Drag and drop an image here, or click to select</p>
            <p className="text-sm text-gray-500">Supports: JPG, PNG, GIF</p>
          </div>
        )}
      </div>

      {previewUrl && (
        <div className="space-y-4">
          <img
            src={previewUrl}
            alt="Preview"
            className="max-h-64 mx-auto rounded-lg shadow-lg"
          />
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="text-red-500 text-sm text-center">{error}</p>
      )}

      {/* Show Transform Modal */}
      {showModal && (
        <TransformModal 
          imageUrl={previewUrl} 
          onClose={() => setShowModal(false)} 
        />
      )}
    </div>
  );
}

export default ImageUpload;
