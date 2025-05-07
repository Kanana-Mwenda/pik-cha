import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { 
  MdUpload,
  MdCrop,
  MdRotateRight,
  MdAutoFixHigh,
  MdFilter,
  MdImage,
  MdDownload
} from 'react-icons/md';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../config';
import { useAuth } from '../store/AuthContext';
import { useNavigate } from 'react-router-dom';

const tools = [
  {
    name: 'Resize',
    icon: MdImage,
    description: 'Adjust image dimensions',
    category: 'basic',
  },
  {
    name: 'Crop',
    icon: MdCrop,
    description: 'Crop image to desired size',
    category: 'basic',
  },
  {
    name: 'Rotate',
    icon: MdRotateRight,
    description: 'Rotate image by angle',
    category: 'basic',
  },
  {
    name: 'Remove Background',
    icon: MdAutoFixHigh,
    description: 'AI-powered background removal',
    category: 'ai',
  },
  {
    name: 'Filters',
    icon: MdFilter,
    description: 'Apply artistic filters',
    category: 'effects',
  },
  {
    name: 'Format',
    icon: MdImage,
    description: 'Convert image format',
    category: 'basic',
  },
];

const Editor = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [transformedImage, setTransformedImage] = useState(null);
  const [activeTool, setActiveTool] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [toolSettings, setToolSettings] = useState({});

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/loginsignup');
    }
  }, [isAuthenticated, navigate]);

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsProcessing(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`${API_BASE_URL}/api/images/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const data = await response.json();
      console.log('Upload response:', data);
      
      if (!data.original_url) {
        throw new Error('Invalid image data received');
      }

      // Process the image URLs
      const processedData = {
        ...data,
        original_url: data.original_url.startsWith('http') 
          ? data.original_url 
          : `${API_BASE_URL}${data.original_url.startsWith('/') ? '' : '/'}${data.original_url}`,
        transformed_url: data.transformed_url 
          ? (data.transformed_url.startsWith('http') 
              ? data.transformed_url 
              : `${API_BASE_URL}${data.transformed_url.startsWith('/') ? '' : '/'}${data.transformed_url}`)
          : null
      };

      console.log('Processed image URLs:', {
        original: processedData.original_url,
        transformed: processedData.transformed_url
      });

      setSelectedImage(processedData);
      setTransformedImage(processedData);
      toast.success('Image uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to upload image');
      if (error.message === 'Not authenticated') {
        navigate('/loginsignup');
      }
    } finally {
      setIsProcessing(false);
    }
  }, [navigate]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
    },
    maxFiles: 1,
    disabled: isProcessing,
  });

  const handleTransform = async (tool, settings) => {
    if (!selectedImage) return;

    setIsProcessing(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/images/${selectedImage.id}/transform`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          transformation: tool.toLowerCase(),
          settings,
        }),
      });

      if (!response.ok) throw new Error('Transformation failed');

      const data = await response.json();
      setTransformedImage(data);
      toast.success('Image transformed successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to transform image');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = async () => {
    if (!transformedImage) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/images/download/${transformedImage.filename}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) throw new Error('Download failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = transformedImage.filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Image downloaded successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to download image');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!selectedImage ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-colors ${
                isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-500'
              }`}
            >
              <input {...getInputProps()} />
              <MdUpload className="h-12 w-12 text-gray-400 mx-auto" />
              <p className="mt-4 text-lg font-medium text-gray-900">
                {isDragActive ? 'Drop your image here' : 'Drag and drop your image here'}
              </p>
              <p className="mt-2 text-sm text-gray-600">or click to select a file</p>
              <p className="mt-1 text-xs text-gray-500">Supports JPG, PNG, GIF, WEBP</p>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Tools Panel */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Tools</h2>
                <div className="space-y-4">
                  {tools.map((tool) => (
                    <motion.button
                      key={tool.name}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveTool(tool)}
                      className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-colors ${
                        activeTool?.name === tool.name
                          ? 'bg-indigo-50 text-indigo-600'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <tool.icon className="h-5 w-5" />
                      <div className="text-left">
                        <p className="font-medium">{tool.name}</p>
                        <p className="text-sm text-gray-500">{tool.description}</p>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            {/* Preview Panel */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Preview</h2>
                  <button
                    onClick={handleDownload}
                    className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-500"
                  >
                    <MdDownload className="h-5 w-5" />
                    <span>Download</span>
                  </button>
                </div>

                <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                  {transformedImage?.transformed_url || selectedImage?.original_url ? (
                    <img
                      src={transformedImage?.transformed_url || selectedImage?.original_url}
                      alt="Preview"
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        console.error('Image load error:', e);
                        console.log('Failed image URL:', transformedImage?.transformed_url || selectedImage?.original_url);
                        console.log('Image element:', e.target);
                        toast.error('Failed to load image preview');
                      }}
                      onLoad={(e) => {
                        console.log('Image loaded successfully:', e.target.src);
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-gray-500">No image preview available</p>
                    </div>
                  )}
                </div>

                {/* Tool Settings */}
                <AnimatePresence>
                  {activeTool && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      className="mt-6 p-4 bg-gray-50 rounded-xl"
                    >
                      <h3 className="font-medium text-gray-900 mb-4">{activeTool.name} Settings</h3>
                      {/* Tool-specific settings will be rendered here */}
                      <div className="space-y-4">
                        {activeTool.name === 'Resize' && (
                          <>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Width</label>
                              <input
                                type="number"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                value={toolSettings.width || ''}
                                onChange={(e) =>
                                  setToolSettings({ ...toolSettings, width: e.target.value })
                                }
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Height</label>
                              <input
                                type="number"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                value={toolSettings.height || ''}
                                onChange={(e) =>
                                  setToolSettings({ ...toolSettings, height: e.target.value })
                                }
                              />
                            </div>
                          </>
                        )}
                        {/* Add more tool-specific settings here */}
                      </div>

                      <div className="mt-6">
                        <button
                          onClick={() => handleTransform(activeTool.name, toolSettings)}
                          disabled={isProcessing}
                          className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                        >
                          {isProcessing ? 'Processing...' : 'Apply'}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        )}

        {/* Processing Overlay */}
        <AnimatePresence>
          {isProcessing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            >
              <div className="bg-white rounded-2xl p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto" />
                <p className="mt-4 text-gray-900">Processing your image...</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Editor; 