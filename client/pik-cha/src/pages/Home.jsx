import React, { useState, useRef } from 'react';
import { TbLibraryPhoto } from "react-icons/tb";
import { CiMenuKebab } from "react-icons/ci";
import { FiLink, FiClipboard } from "react-icons/fi";
import bgImage from '../assets/bglanding.png';

import '../index.css';

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
    <div className="home-wrapper">
      {/* Landing Section */}
      <div
        className="landing-section"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          padding: '150px 20px',
          color: 'white',
          textAlign: 'center',
        }}
      >
        <div className="landing-card">
  <h1 className="landing-title">Welcome to Pik-cha</h1>
  <p className="landing-description">
    Modern AI Powered Photo Editor for Quick and Professional Edits
  </p>
  <button className="edit-image-btn" onClick={scrollToEditor}>Edit Image</button>
</div>

      </div>

      {/* Image Editor Section */}
      <div className="home-container" ref={editorRef}>
        <div className="editor-panel">
          <div className="toolbar">
            <button className="menukebab-button" onClick={toggleMenu} aria-label="Menu">
              <CiMenuKebab />
            </button>
            {menuVisible && (
              <div className="menukebab-menu">
                <button className="menukebab-menu-item" onClick={openUrlModal}>
                  <FiLink className="menukebab-menu-icon" />
                  Load from URL
                </button>
                <button className="menukebab-menu-item" onClick={handlePasteFromClipboard}>
                  <FiClipboard className="menukebab-menu-icon" />
                  Paste from clipboard
                </button>
              </div>
            )}
          </div>

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
            className="image-drop-zone"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            title="Drag and drop an image here"
          >
            {selectedImage ? (
              <img src={selectedImage} alt="Preview" className="preview-image" />
            ) : (
              <TbLibraryPhoto size={120} />
            )}
          </div>

          <div className="action-buttons">
            <button className="open-image-btn" onClick={handleOpenImageClick}>+ Open Image</button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <button className="create-btn">Create New</button>
            <button className="create-btn">Create Collage</button>
          </div>
        </div>

        <div className="info-panel">
          <h1 className="title">AI Powered Photo Editor</h1>
          <p className="description">
            Start editing by uploading or dragging a photo. Use powerful AI tools for smart edits, filters, and more!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
