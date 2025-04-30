

import React from 'react';

const ImageList = ({ images, onImageClick, onImageDelete }) => {
  if (images.length === 0) return <p>No images uploaded.</p>;

  return (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      {images.map((img) => (
        <div key={img.id} style={{ position: 'relative' }}>
          <img
            src={img.url}
            alt={img.name || 'Uploaded'}
            style={{ width: 150, height: 150, objectFit: 'cover', cursor: 'pointer' }}
            onClick={() => onImageClick(img)}
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              onImageDelete(img.id);
            }}
            style={{
              position: 'absolute',
              top: 5,
              right: 5,
              background: 'white',
              border: '1px solid gray',
              cursor: 'pointer',
              padding: '5px',
            }}
            title="Delete Image"
          >
            ❌
          </button>
        </div>
      ))}
    </div>
  );
};

export default ImageList;
