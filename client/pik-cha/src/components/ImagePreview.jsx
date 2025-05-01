

import React from 'react';

const ImagePreview = ({ image, onClose }) => {
  if (!image) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: '#fff',
          padding: '1rem',
          borderRadius: '12px',
          maxWidth: '80%',
          maxHeight: '80%',
          overflow: 'auto',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '0.5rem',
            right: '0.5rem',
            background: 'transparent',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            color: '#333',
          }}
          aria-label="Close"
        >
          &times;
        </button>

        <img
          src={image.url}
          alt={image.name || 'Preview'}
          style={{
            maxWidth: '100%',
            maxHeight: '70vh',
            objectFit: 'contain',
            borderRadius: '8px',
          }}
        />
        <p style={{ marginTop: '1rem', fontWeight: 'bold' }}>{image.name || 'Unnamed Image'}</p>
      </div>
    </div>
  );
};

export default ImagePreview;

