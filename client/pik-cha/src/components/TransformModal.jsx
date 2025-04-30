// src/components/TransformModal.jsx
import { useState } from 'react';

function TransformModal({ imageUrl, onClose }) {
  const [rotation, setRotation] = useState(0);
  const [grayscale, setGrayscale] = useState(false);
  const [flipped, setFlipped] = useState(false);

  const handleRotate = () => {
    setRotation((prev) => prev + 90);
  };

  const handleGrayscale = () => {
    setGrayscale((prev) => !prev);
  };

  const handleFlip = () => {
    setFlipped((prev) => !prev);
  };

  const handleSave = () => {
    alert("Changes saved (fake for now)!");
    onClose();
  };

  const imgStyles = {
    transform: `
      rotate(${rotation}deg)
      scaleX(${flipped ? -1 : 1})
    `,
    filter: grayscale ? "grayscale(100%)" : "none",
    transition: "all 0.3s ease",
    width: "300px",
    height: "300px",
    objectFit: "cover",
    borderRadius: "8px"
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-[400px] flex flex-col items-center">
        <h2 className="text-xl font-bold mb-4">Transform Your Image</h2>

        <img src={imageUrl} alt="To Transform" style={imgStyles} />

        <div className="flex gap-3 mt-4">
          <button 
            onClick={handleRotate}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Rotate 90°
          </button>
          <button 
            onClick={handleGrayscale}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            {grayscale ? "Remove Grayscale" : "Grayscale"}
          </button>
          <button 
            onClick={handleFlip}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Flip
          </button>
        </div>

        <div className="flex gap-4 mt-6">
          <button 
            onClick={handleSave}
            className="px-6 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
          >
            Save Changes
          </button>
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default TransformModal;
