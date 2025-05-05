import React, { useEffect, useState } from "react";
import axios from "axios";

const ImageList = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get("/api/images"); // Adjust API endpoint
        setImages(response.data);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
  }, []);

  return (
    <div className="image-list">
      {images.map((image) => (
        <div key={image.id} className="image-item">
          <img src={image.url} alt={image.name} />
          <p>{image.name}</p>
          <p>Uploaded: {new Date(image.uploadDate).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
};

export default ImageList;