import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as HeroIcons from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../config';
import axios from 'axios';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('You must be logged in to view images');
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/api/images/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Received images:', response.data);
      setImages(response.data); // Ensure transformed_url is included in the response
    } catch (error) {
      console.error('Error fetching images:', error);
      toast.error('Failed to load images');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (image) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('You must be logged in to download images');
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/api/images/download/${image.filename}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = image.filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Image downloaded successfully!');
    } catch (error) {
      console.error('Error downloading image:', error);
      toast.error('Failed to download image');
    }
  };

  const handleDelete = async (imageId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('You must be logged in to delete images');
        return;
      }

      await axios.delete(`${API_BASE_URL}/api/images/${imageId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setImages(images.filter(img => img.id !== imageId));
      toast.success('Image deleted successfully!');
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Failed to delete image');
    }
  };

  if (loading) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <HeroIcons.PhotoIcon className="h-12 w-12 text-gray-400 animate-pulse mx-auto" />
          <p className="mt-4 text-gray-600">Loading images...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] p-8 bg-gradient-to-br from-indigo-200 via-purple-200 to-cyan-100/80">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Images</h1>
        
        {images.length === 0 ? (
          <div className="text-center py-12">
            <HeroIcons.PhotoIcon className="h-16 w-16 text-gray-400 mx-auto" />
            <p className="mt-4 text-gray-600">No images yet. Start by uploading one!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {images.map((image) => (
              <motion.div
                key={image.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden"
              >
                <img
                  src={
                    image.transformed_url
                      ? (image.transformed_url.startsWith('http')
                          ? image.transformed_url
                          : `${API_BASE_URL}${image.transformed_url}`)
                      : (image.original_url.startsWith('http')
                          ? image.original_url
                          : `${API_BASE_URL}${image.original_url}`)
                  }
                  alt={image.filename}
                  className="w-full h-full object-cover"
                />
                
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex space-x-4">
                    <button
                      onClick={() => handleDownload(image)}
                      className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <HeroIcons.ArrowDownTrayIcon className="h-5 w-5 text-gray-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(image.id)}
                      className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <HeroIcons.TrashIcon className="h-5 w-5 text-red-600" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Image Preview Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-4xl w-full"
              onClick={e => e.stopPropagation()}
            >
              <img
                src={
                  selectedImage.original_url.startsWith('http')
                    ? selectedImage.original_url
                    : `${API_BASE_URL}${selectedImage.original_url}`
                }
                alt={selectedImage.filename}
                className="w-full h-auto rounded-lg"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 p-2 bg-white rounded-full hover:bg-gray-100"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;