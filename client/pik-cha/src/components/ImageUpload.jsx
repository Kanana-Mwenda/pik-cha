// src/components/ImageUpload.jsx
import { useState } from 'react';
import { validateFileType } from '../utils/validateFileType';
import TransformModal from './TransformModal';

function ImageUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!validateFileType(file)) {
      setError("Unsupported file type. Please upload a JPG or PNG.");
      return;
    }

    setError("");
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleUpload = () => {
    if (!selectedFile) {
      setError("No file selected!");
      return;
    }

    console.log("Pretending to upload:", selectedFile.name);
    alert("Upload successful! (Simulated)");
  };

  const handleEdit = () => {
    if (!previewUrl) {
      setError("No image to edit!");
      return;
    }
    setShowModal(true);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 border border-dashed border-gray-400 rounded-lg">
      <input 
        type="file" 
        accept="image/*" 
        onChange={handleFileChange} 
        className="mb-4"
      />

      {previewUrl && (
        <>
          <img 
            src={previewUrl} 
            alt="Selected" 
            className="w-40 h-40 object-cover mb-4 rounded-lg"
          />
          <div className="flex gap-4">
            <button 
              onClick={handleUpload}
              className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Upload
            </button>
            <button 
              onClick={handleEdit}
              className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Edit
            </button>
          </div>
        </>
      )}

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {/* Show Transform Modal */}
      {showModal && (
        <TransformModal 
          imageUrl={previewUrl} 
          onClose={() => setShowModal(false)} 
        />
      )}
    </div>
  );
}

export default ImageUpload;
