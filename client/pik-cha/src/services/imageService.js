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
