import React from "react";

const ImagePreview = ({ imageUrl, onDownload, onTransform }) => {
  if (!imageUrl) return null;

  return (
    <div className="image-preview">
      <img src={imageUrl} alt="Preview" className="preview-image" />
      <div className="preview-actions">
        <button onClick={onDownload}>Download</button>
        <button onClick={onTransform}>Apply Transformations</button>
      </div>
    </div>
  );
};

export default ImagePreview;