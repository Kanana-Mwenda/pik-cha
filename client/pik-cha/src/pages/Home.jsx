import React, { useState, useRef } from 'react';
import { TbLibraryPhoto } from "react-icons/tb";
import { CiMenuKebab } from "react-icons/ci";
import { FiLink, FiClipboard } from "react-icons/fi";
import bgImage from '../assets/bglanding.png';

const Home = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [urlModalVisible, setUrlModalVisible] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const fileInputRef = useRef(null);
  const editorRef = useRef(null);

  const handleOpenImageClick = () => fileInputRef.current?.click();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file?.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setSelectedImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files[0];
    if (file?.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setSelectedImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const toggleMenu = () => setMenuVisible(!menuVisible);

  const openUrlModal = () => {
    setMenuVisible(false);
    setUrlModalVisible(true);
  };

  const closeUrlModal = () => {
    setUrlModalVisible(false);
    setImageUrl('');
  };

  const handleLoadFromURL = () => {
    if (imageUrl.trim()) {
      setSelectedImage(imageUrl.trim());
      closeUrlModal();
    }
  };

  const handlePasteFromClipboard = async () => {
    setMenuVisible(false);
    try {
      const text = await navigator.clipboard.readText();
      if (text.startsWith('http://') || text.startsWith('https://')) {
        setSelectedImage(text);
      } else {
        alert('Clipboard does not contain a valid image URL.');
      }
    } catch {
      alert('Failed to read clipboard contents.');
    }
  };

  const scrollToEditor = () => {
    editorRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col">
      {/* Landing Section */}
      <div
        className="relative w-full h-[600px] bg-cover bg-center bg-no-repeat text-white flex items-center justify-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="bg-black bg-opacity-60 p-10 rounded-lg shadow-lg max-w-lg text-center">
          <h1 className="text-4xl mb-5">Welcome to Pik-cha</h1>
          <p className="text-xl mb-6">Modern AI Powered Photo Editor for Quick and Professional Edits</p>
          <button
            className="px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition"
            onClick={scrollToEditor}
          >
            Edit Image
          </button>
        </div>
      </div>

      {/* Image Editor Section */}
      <div className="flex justify-center items-center py-10 px-4 bg-gray-800 min-h-screen" ref={editorRef}>
        <div className="bg-gray-600 w-full md:w-[500px] p-6 rounded-lg shadow-xl relative">
          <div className="flex justify-end">
            <button
              className="text-white text-2xl"
              onClick={toggleMenu}
              aria-label="Menu"
            >
              <CiMenuKebab />
            </button>
          </div>

          {menuVisible && (
            <div className="absolute top-16 right-6 bg-gray-600 rounded-md shadow-md z-10">
              <button
                className="flex items-center p-3 text-white hover:bg-blue-600"
                onClick={openUrlModal}
              >
                <FiLink className="mr-2" />
                Load from URL
              </button>
              <button
                className="flex items-center p-3 text-white hover:bg-blue-600"
                onClick={handlePasteFromClipboard}
              >
                <FiClipboard className="mr-2" />
                Paste from clipboard
              </button>
            </div>
          )}

          {urlModalVisible && (
            <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-lg text-gray-800 w-[320px]">
                <h2 className="text-xl mb-4">Load Image from URL</h2>
                <input
                  type="text"
                  placeholder="Enter image URL"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full p-3 border rounded-lg mb-4"
                />
                <div className="flex justify-end gap-3">
                  <button
                    onClick={handleLoadFromURL}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
                  >
                    Load
                  </button>
                  <button
                    onClick={closeUrlModal}
                    className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          <div
            className="w-full h-[280px] border-2 border-dashed border-gray-400 rounded-lg bg-gray-700 flex items-center justify-center cursor-pointer"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            title="Drag and drop an image here"
          >
            {selectedImage ? (
              <img src={selectedImage} alt="Preview" className="w-full h-full object-contain" />
            ) : (
              <TbLibraryPhoto size={120} className="text-gray-500" />
            )}
          </div>

          <div className="flex flex-col items-center gap-3 mt-6">
            <button
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition"
              onClick={handleOpenImageClick}
            >
              + Open Image
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <button className="w-full py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition">
              Create New
            </button>
            <button className="w-full py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition">
              Create Collage
            </button>
          </div>
        </div>

        <div className="max-w-[500px] ml-10 text-white">
          <h1 className="text-4xl mb-6">AI Powered Photo Editor</h1>
          <p className="text-lg text-gray-300">
            Start editing by uploading or dragging a photo. Use powerful AI tools for smart edits, filters, and more!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
