import React, { useState, useEffect, useCallback } from "react";
import { FaTimes, FaSave, FaDownload } from "react-icons/fa";

/**
 * Modal component for previewing and editing image details
 * @param {Object} image - The image object to preview
 * @param {Function} onClose - Handler for closing the preview
 * @param {Function} onUpdateTitle - Optional handler for updating the image title
 */
const ImagePreview = ({ image, onClose, onUpdateTitle }) => {
  // Track the edited title separately to allow cancellation
  const [editedTitle, setEditedTitle] = useState(image.title || "");
  const [isEditing, setIsEditing] = useState(false);
  
  // Reset the edited title when the image changes
  useEffect(() => {
    setEditedTitle(image.title || "");
    setIsEditing(false);
  }, [image]);

  // Handle keyboard events - ESC to close, Enter to save
  const handleKeyDown = useCallback((e) => {
    if (e.key === "Escape") {
      onClose();
    } else if (e.key === "Enter" && isEditing && onUpdateTitle) {
      onUpdateTitle(image.id, editedTitle);
      setIsEditing(false);
    }
  }, [image.id, editedTitle, isEditing, onClose, onUpdateTitle]);

  // Add keyboard event listeners
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  // Handle the overlay click to close
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle the title save action
  const handleSaveTitle = () => {
    if (onUpdateTitle) {
      onUpdateTitle(image.id, editedTitle);
      setIsEditing(false);
    }
  };

  // Handle the download action
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = image.url;
    link.download = image.title || 'image';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-3xl w-full shadow-xl overflow-hidden">
        {/* Header with title and close button */}
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h2 className="text-xl font-semibold dark:text-white">
            {image.title || "Image Preview"}
          </h2>
          <div className="flex items-center gap-3">
            {/* Download button */}
            <button
              onClick={handleDownload}
              className="text-gray-600 dark:text-white hover:text-blue-500 transition-colors"
              title="Download image"
            >
              <FaDownload />
            </button>
            
            {/* Close button */}
            <button
              onClick={onClose}
              className="text-gray-600 dark:text-white hover:text-red-500 transition-colors"
              title="Close preview"
            >
              <FaTimes />
            </button>
          </div>
        </div>
        
        {/* Enhanced image display */}
        <div className="relative bg-gray-900">
          <img
            src={image.url}
            alt={image.title || "Preview"}
            className="w-full max-h-[75vh] object-contain mx-auto"
            style={{ minHeight: '350px' }}
          />
          
          {/* Image category tag */}
          {image.category && (
            <div className="absolute top-4 left-4">
              <span className="bg-blue-600 text-white text-sm px-3 py-1 rounded-full font-medium">
                {image.category.charAt(0).toUpperCase() + image.category.slice(1)}
              </span>
            </div>
          )}
          
          {/* Image metadata with improved styling */}
          {image.description && (
            <div className="p-4 bg-gray-100 dark:bg-gray-800 dark:text-white border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Description</h3>
              <p className="text-gray-800 dark:text-gray-200">{image.description}</p>
            </div>
          )}
        </div>
        
        {/* Title editing form */}
        {onUpdateTitle && (
          <div className="p-4 flex items-center gap-2">
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onFocus={() => setIsEditing(true)}
              className="flex-1 px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Image title"
              aria-label="Image title"
            />
            
            {isEditing && (
              <button
                onClick={handleSaveTitle}
                className="bg-green-500 hover:bg-green-600 text-white p-2 rounded transition-colors"
                title="Save title"
              >
                <FaSave />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};


export default ImagePreview;