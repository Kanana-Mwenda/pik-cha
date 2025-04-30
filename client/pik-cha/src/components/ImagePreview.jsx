import React from 'react';

const ImagePreview = ({ image, onClose }) => {
  return (
    <div>
      <div>
        <img src={image.url} alt={image.name || 'Preview'} />
        <button onClick={onClose}>✕</button>
      </div>
    </div>
  );
};

export default ImagePreview;
