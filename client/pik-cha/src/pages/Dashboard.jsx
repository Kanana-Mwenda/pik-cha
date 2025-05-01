import React, { useState, useEffect } from 'react';
import ImageList from '../components/ImageList';
import ImagePreview from '../components/ImagePreview';

const Dashboard = () => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);

  const fetchImages = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/images', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setImages(data);
      } else {
        setError('Failed to load images');
      }
    } catch (error) {
      setError('Error fetching images');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const handleClosePreview = () => {
    setSelectedImage(null);
  };

  const handleImageDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/images/${imageToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
        },
      });

      if (response.ok) {
        fetchImages();
        setIsConfirmingDelete(false);
      } else {
        setError('Failed to delete image');
      }
    } catch (error) {
      setError('Error deleting image');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleConfirmDelete = (image) => {
    setImageToDelete(image);
    setIsConfirmingDelete(true);
  };

  const handleCancelDelete = () => {
    setIsConfirmingDelete(false);
    setImageToDelete(null);
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>

      <div>
        <h2>Your Images</h2>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <ImageList
              images={images}
              onImageClick={handleImageClick}
              onImageDelete={handleConfirmDelete}
            />
          </>
        )}
      </div>

      {selectedImage && (
        <ImagePreview 
          image={selectedImage} 
          onClose={handleClosePreview} 
        />
      )}

      {isConfirmingDelete && (
        <div style={{ 
          position: 'fixed', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)', 
          background: 'white', 
          padding: '20px', 
          border: '1px solid black' 
        }}>
          <p>Are you sure you want to delete this image?</p>
          <button onClick={handleImageDelete} disabled={isDeleting}>
            {isDeleting ? 'Deleting...' : 'Yes'}
          </button>
          <button onClick={handleCancelDelete}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
