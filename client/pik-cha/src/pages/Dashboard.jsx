


import React, { useState, useEffect } from 'react';
import ImageUpload from '../components/ImageUpload';
import ImageList from '../components/ImageList';
import ImagePreview from '../components/ImagePreview';

const Dashboard = () => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Function to fetch images from the server
  const fetchImages = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/images');
      if (response.ok) {
        const data = await response.json();
        setImages(data);
      } else {
        console.error('Failed to fetch images.');
      }
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  // Function to handle image click (for preview)
  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  // Function to handle closing the image preview
  const handleClosePreview = () => {
    setSelectedImage(null);
  };

  // Function to handle image deletion
  const handleImageDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this image?');
    if (!confirmDelete) return; // If the user cancels, return early

    try {
      const response = await fetch(`/api/images/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Image deleted successfully!');
        fetchImages(); // Re-fetch images after deletion
      } else {
        alert('Failed to delete the image. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('An error occurred while deleting the image.');
    }
  };

  // Function to handle uploading completion
  const handleUploadComplete = () => {
    fetchImages(); // Refetch images after upload
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Photo Editor Dashboard</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>Upload New Image</h2>
        <ImageUpload onUploadComplete={handleUploadComplete} />
      </div>
      
      <div>
        <h2>Your Images</h2>
        {isLoading ? (
          <p>Loading images...</p>
        ) : (
          <ImageList
            images={images}
            onImageClick={handleImageClick}
            onImageDelete={handleImageDelete}
          />
        )}
      </div>
      
      {selectedImage && (
        <ImagePreview
          image={selectedImage}
          onClose={handleClosePreview}
        />
      )}
    </div>
  );
};

export default Dashboard;
