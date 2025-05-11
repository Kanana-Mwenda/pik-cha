import axios from './axios';

const mockUploadResponse = {
  id: 'mock-id-123',
  url: 'https://via.placeholder.com/300.png?text=Uploaded+Image',
};

const mockTransformResponse = {
  id: 'mock-id-123',
  url: 'https://via.placeholder.com/300.png?text=Transformed+Image',
};

// Mock upload image function
export const uploadImage = async (formData) => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockUploadResponse;
};

// Mock transform image function
export const transformImage = async (imageId, transformations) => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockTransformResponse;
};

export const imageService = {
  async uploadImage(file) {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post('/images/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Upload failed' };
    }
  },

  async listImages() {
    try {
      const response = await axios.get('/images');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch images' };
    }
  },

  async transformImage(imageId, transformation) {
    try {
      const response = await axios.post(`/images/${imageId}/transform`, transformation);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Transformation failed' };
    }
  },

  async deleteImage(imageId) {
    try {
      await axios.delete(`/images/${imageId}`);
      return true;
    } catch (error) {
      throw error.response?.data || { error: 'Deletion failed' };
    }
  },

  async downloadImage(filename) {
    try {
      const response = await axios.get(`/images/download/${filename}`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Download failed' };
    }
  },

  getImageUrl(filename) {
    return `${process.env.VITE_API_URL}/uploads/${filename}`;
  }
};
