// src/mockServer.js

export const mockApi = {
    fetchImages: async () => {
      return [
        {
          id: "1",
          name: "Beach Sunset",
          url: "https://via.placeholder.com/300x200?text=Beach",
          tags: ["sunset", "beach", "vacation"],
        },
        {
          id: "2",
          name: "Mountain View",
          url: "https://via.placeholder.com/300x200?text=Mountain",
          tags: ["mountain", "hiking", "nature"],
        },
      ];
    },
  
    uploadImage: async (file) => {
      return {
        id: String(Date.now()),
        name: file.name,
        url: URL.createObjectURL(file),
        tags: [],
      };
    },
  
    deleteImage: async (id) => {
      return { success: true };
    },
  
    editImage: async (id, data) => {
      return { id, ...data };
    },
  
    fetchUserProfile: async () => {
      return {
        name: "Jane Doe",
        avatar: "https://via.placeholder.com/100",
        email: "jane@example.com",
      };
    },
  };
  