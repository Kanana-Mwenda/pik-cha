import React, { useState } from "react";
import ImageList from "../components/ImageList";
import ImagePreview from "../components/ImagePreview";

const Dashboard = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageSelect = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const handleDownload = () => {
    // Logic to download the selected image
    console.log("Downloading:", selectedImage);
  };

  return (
    <div className="dashboard">
      <h1>Your Images</h1>
      <ImageList onSelectImage={handleImageSelect} />
      <ImagePreview imageUrl={selectedImage} onDownload={handleDownload} />
    </div>
  );
};

export default Dashboard;