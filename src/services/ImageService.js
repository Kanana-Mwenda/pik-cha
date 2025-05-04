// src/services/ImageService.js

// Mock image data
let mockImages = [
    { id: 1, name: "Beach Sunset", url: "/sample-images/beach.jpg", tags: ["beach", "sunset"] },
    { id: 2, name: "Mountain Hike", url: "/sample-images/mountain.jpg", tags: ["mountain", "nature"] },
    { id: 3, name: "City Lights", url: "/sample-images/city.jpg", tags: ["city", "night"] }
  ];
  
  // Simulate API delay
  const simulateDelay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  
  export async function fetchImages() {
    await simulateDelay(500);
    return [...mockImages]; // Return a copy
  }
  
  export async function deleteImage(id) {
    await simulateDelay(300);
    mockImages = mockImages.filter((img) => img.id !== id);
    return true;
  }
  
  export async function uploadImage(newImage) {
    await simulateDelay(500);
    const id = Date.now();
    mockImages.push({ ...newImage, id });
    return true;
  }
  