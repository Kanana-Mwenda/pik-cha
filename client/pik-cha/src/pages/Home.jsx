import React, { useState, useRef } from 'react';
import { TbLibraryPhoto } from "react-icons/tb";
import { CiMenuKebab } from "react-icons/ci";
import { FiLink, FiClipboard } from "react-icons/fi";
import '../index.css';

const Home = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [urlModalVisible, setUrlModalVisible] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const fileInputRef = useRef(null);

  const handleOpenImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
      };
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
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

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
      if (text && (text.startsWith('http://') || text.startsWith('https://'))) {
        setSelectedImage(text);
      } else {
        alert('Clipboard does not contain a valid image URL.');
      }
    } catch (err) {
      alert('Failed to read clipboard contents.');
    }
  };

  return (
    <div className="home-container">
      <div className="left-panel" style={{ position: 'relative' }}>
        <button
          type="button"
          aria-label="Menu"
          className="menukebab-button"
          onClick={toggleMenu}
        >
          <CiMenuKebab />
        </button>
        {menuVisible && (
          <div className="menukebab-menu">
            <button className="menukebab-menu-item" onClick={openUrlModal}>
              <FiLink className="menukebab-menu-icon" />
              Load image from URL
            </button>
            <button className="menukebab-menu-item" onClick={handlePasteFromClipboard}>
              <FiClipboard className="menukebab-menu-icon" />
              Paste from clipboard
            </button>
          </div>
        )}

        {urlModalVisible && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Load Image from URL</h2>
              <input
                type="text"
                placeholder="Enter image URL"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="url-input"
              />
              <div className="modal-buttons">
                <button onClick={handleLoadFromURL} className="modal-load-btn">Load</button>
                <button onClick={closeUrlModal} className="modal-cancel-btn">Cancel</button>
              </div>
            </div>
          </div>
        )}

        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          style={{ marginTop: '30px', cursor: 'pointer', width: '160px', height: '160px' }}
          title="Drag and drop an image here"
        >
          {selectedImage ? (
            <img src={selectedImage} alt="Selected" style={{ width: '100%', height: '100%', borderRadius: '10px', objectFit: 'cover' }} />
          ) : (
            <TbLibraryPhoto size={160} style={{ marginBottom: '10px' }} />
          )}
        </div>
        <div className="image-placeholder">
          <button className="open-image-btn" onClick={handleOpenImageClick}>+ Open image</button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          <div className="create-buttons">
            <button className="create-btn">Create new</button>
            <button className="create-btn">Create collage</button>
          </div>
        </div>
      </div>

      <div className="right-panel">
        <h1 className="title">Modern AI Powered Photo Editor for Quick and Professional Edits</h1>
        <p className="description">
          Welcome to the free modern AI powered photo editor by Pik-cha. Start editing by
          clicking on the open photo button, drag n' drop a file or paste from the clipboard (ctrl+v).
        </p>
      </div>
    </div>
  );
};

export default Home;
