

import React from 'react';

const ImageList = ({ images, onImageClick }) => {
  if (!images.length) return <p>No images uploaded yet.</p>;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
      {images.map((img) => (
        <div
          key={img.id}
          style={{
            position: 'relative',
            cursor: 'pointer',
            border: '1px solid #ccc',
            borderRadius: '8px',
            overflow: 'hidden',
          }}
          onClick={() => onImageClick(img)}
        >
          <img src={img.url} alt={img.name || 'Uploaded'} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
        </div>
      ))}
    </div>
  );
};

export default ImageList;
