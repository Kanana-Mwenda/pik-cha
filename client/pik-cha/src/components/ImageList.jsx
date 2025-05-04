import React from "react";
import { FaEye, FaTrash, FaEdit } from "react-icons/fa";


/**
 * A responsive grid display of images with action buttons
 * @param {Object[]} images - Array of image objects to display
 * @param {function} onImageClick - Handler for when an image is clicked
 * @param {function} onPreview - Handler for preview button
 * @param {function} onEdit - Handler for edit button
 * @param {function} onDelete - Handler for delete button
 */
const ImageList = ({ images, onImageClick, onPreview, onEdit, onDelete }) => {
  // Use the appropriate handler based on availability
  const handleImageClick = (image) => {
    if (onImageClick) {
      onImageClick(image);
    } else if (onPreview) {
      onPreview(image);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 p-4">
      {images.map((image) => (
        <div
          key={image.id}
          className="relative rounded-lg overflow-hidden shadow-lg bg-white dark:bg-gray-800 transition-all hover:shadow-xl hover:scale-102 group"
        >
          {/* Image thumbnail with improved styling */}
          <div className="relative overflow-hidden h-56">
            <img
              src={image.url}
              alt={image.title || "Image"}
              className="w-full h-full object-cover cursor-pointer transition-transform duration-500 group-hover:scale-110"
              onClick={() => handleImageClick(image)}
              loading="lazy"
            />
            
            {/* Semi-transparent overlay on hover */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
            
            {/* Category badge */}
            {image.category && (
              <span className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-full">
                {image.category.charAt(0).toUpperCase() + image.category.slice(1)}
              </span>
            )}
          </div>
          
          {/* Image title with improved styling */}
          <div className="p-3 dark:text-white">
            <h3 className="font-medium truncate" title={image.title}>
              {image.title}
            </h3>
            {image.description && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2" title={image.description}>
                {image.description}
              </p>
            )}
          </div>
          
          {/* Action buttons with improved styling */}
          <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={() => onPreview ? onPreview(image) : onImageClick(image)}
              className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full transition-colors duration-200 shadow-md"
              title="Preview image"
              aria-label="Preview image"
            >
              <FaEye size={14} />
            </button>
            
            {onEdit && (
              <button
                onClick={() => onEdit(image.id)}
                className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full transition-colors duration-200 shadow-md"
                title="Edit image"
                aria-label="Edit image"
              >
                <FaEdit size={14} />
              </button>
            )}
            
            {onDelete && (
              <button
                onClick={() => onDelete(image.id)}
                className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors duration-200 shadow-md"
                title="Delete image"
                aria-label="Delete image"
              >
                <FaTrash size={14} />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};



export default ImageList;