import React, { createContext, useContext, useState } from 'react';
import { imageService } from '../services/imageService';

const ImageContext = createContext(null);

export const ImageProvider = ({ children }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const fetchImages = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await imageService.listImages();
      setImages(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (file) => {
    try {
      setLoading(true);
      setError(null);
      setUploadProgress(0);

      const data = await imageService.uploadImage(file);
      setImages(prev => [...prev, data]);
      setUploadProgress(100);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const transformImage = async (imageId, transformation) => {
    try {
      setLoading(true);
      setError(null);
      const data = await imageService.transformImage(imageId, transformation);
      setImages(prev => prev.map(img => 
        img.id === imageId ? { ...img, ...data } : img
      ));
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteImage = async (imageId) => {
    try {
      setLoading(true);
      setError(null);
      await imageService.deleteImage(imageId);
      setImages(prev => prev.filter(img => img.id !== imageId));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = async (filename) => {
    try {
      setLoading(true);
      setError(null);
      const blob = await imageService.downloadImage(filename);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    images,
    loading,
    error,
    uploadProgress,
    fetchImages,
    uploadImage,
    transformImage,
    deleteImage,
    downloadImage,
  };

  return <ImageContext.Provider value={value}>{children}</ImageContext.Provider>;
};

export const useImages = () => {
  const context = useContext(ImageContext);
  if (!context) {
    throw new Error('useImages must be used within an ImageProvider');
  }
  return context;
}; 