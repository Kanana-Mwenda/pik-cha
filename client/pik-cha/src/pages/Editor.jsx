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
import './EditorCropper.css';

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
  {
    name: 'Watermark',
    icon: MdImage,
    description: 'Add a watermark to the image',
    category: 'effects',
  },
  {
    name: 'Flip',
    icon: MdImage,
    description: 'Flip the image vertically',
    category: 'basic',
  },
  {
    name: 'Mirror',
    icon: MdImage,
    description: 'Mirror the image horizontally',
    category: 'basic',
  },
  {
    name: 'Compress',
    icon: MdImage,
    description: 'Compress the image with specified quality',
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
  const [originalImageSize, setOriginalImageSize] = useState({ width: 0, height: 0 });
  const [initialCropSet, setInitialCropSet] = useState(false);
  const [transformationQueue, setTransformationQueue] = useState([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/loginsignup');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const imgUrl = transformedImage?.transformed_url
      ? (transformedImage.transformed_url.startsWith('http')
          ? transformedImage.transformed_url
          : `${API_BASE_URL}${transformedImage.transformed_url}`)
      : selectedImage?.original_url
        ? (selectedImage.original_url.startsWith('http')
            ? selectedImage.original_url
            : `${API_BASE_URL}${selectedImage.original_url}`)
        : '';
    if (!imgUrl) return;
    const img = new window.Image();
    img.onload = () => {
      setOriginalImageSize({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.src = imgUrl;
  }, [selectedImage, transformedImage]);

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

  const handleTransform = (tool, settings) => {
    if (!selectedImage) return;

    let type = tool.toLowerCase();
    let options = {};

    // Map tool names to backend types and required options
    switch (type) {
      case 'resize':
        options = {
          width: Number(settings.width),
          height: Number(settings.height),
        };
        break;
      case 'crop':
        options = {
          left: Number(settings.left),
          top: Number(settings.top),
          right: Number(settings.right),
          bottom: Number(settings.bottom),
        };
        break;
      case 'rotate':
        options = {
          angle: Number(settings.angle) || 90,
        };
        break;
      case 'remove background':
      case 'remove_bg':
        type = 'remove_bg';
        options = {};
        break;
      case 'format':
        options = {
          format: settings.format || 'png',
        };
        break;
      case 'filters':
      case 'filter':
        type = 'filter';
        options = {
          filter: settings.filter || 'grayscale',
        };
        break;
      case 'watermark':
        options = {
          text: settings.text || 'Pik-Cha',
        };
        break;
      case 'flip':
        type = 'flip';
        options = {};
        break;
      case 'mirror':
        type = 'mirror';
        options = {};
        break;
      case 'compress':
        options = {
          quality: Number(settings.quality) || 75,
        };
        break;
      default:
        break;
    }

    // Add the transformation to the queue
    setTransformationQueue((prevQueue) => [...prevQueue, { type, options }]);
    toast.success(`${tool} transformation added to the queue!`);
  };

  const handleDownload = async () => {
    const imageToDownload = transformedImage?.transformed_url || selectedImage?.original_url;
    if (!imageToDownload) return;

    try {
      const url = imageToDownload.startsWith('http')
        ? imageToDownload
        : `${API_BASE_URL}${imageToDownload}`;
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) throw new Error('Download failed');

      const blob = await response.blob();
      const a = document.createElement('a');
      a.href = window.URL.createObjectURL(blob);
      a.download = url.split('/').pop();
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(a.href);
      document.body.removeChild(a);
      toast.success('Image downloaded successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to download image');
    }
  };

  const handleSave = async () => {
    if (!transformationQueue.length) {
      toast.error('No transformations to save!');
      return;
    }

    setIsProcessing(true);
    try {
      const imageId = transformedImage?.id || selectedImage.id;
      const payload = { transformations: transformationQueue };

      const response = await fetch(`${API_BASE_URL}/api/images/${imageId}/transform`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save transformations');
      }

      const data = await response.json();
      setTransformedImage(data);
      setTransformationQueue([]); // Clear the queue after saving
      toast.success('Transformations saved successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to save transformations');
    } finally {
      setIsProcessing(false);
    }
  };

  const isCropInvalid =
    activeTool && activeTool.name === 'Crop' && (
      isNaN(Number(toolSettings.left)) ||
      isNaN(Number(toolSettings.top)) ||
      isNaN(Number(toolSettings.right)) ||
      isNaN(Number(toolSettings.bottom)) ||
      Number(toolSettings.left) < 0 ||
      Number(toolSettings.top) < 0 ||
      Number(toolSettings.right) > originalImageSize.width ||
      Number(toolSettings.bottom) > originalImageSize.height ||
      Number(toolSettings.left) >= Number(toolSettings.right) ||
      Number(toolSettings.top) >= Number(toolSettings.bottom)
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-200 via-purple-200 to-cyan-100/80">
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

                <img
                  src={
                    transformedImage?.transformed_url
                      ? (transformedImage.transformed_url.startsWith('http')
                          ? transformedImage.transformed_url
                          : `${API_BASE_URL}${transformedImage.transformed_url}`)
                      : selectedImage?.original_url
                        ? (selectedImage.original_url.startsWith('http')
                            ? selectedImage.original_url
                            : `${API_BASE_URL}${selectedImage.original_url}`)
                        : ''
                  }
                  alt="Preview"
                  className="w-full h-auto max-h-[350px] object-contain"
                  onError={(e) => {
                    console.error('Image load error:', e);
                    console.log('Failed image URL:', transformedImage?.transformed_url || selectedImage?.original_url);
                    toast.error('Failed to load image preview');
                  }}
                  onLoad={(e) => {
                    console.log('Image loaded successfully:', e.target.src);
                  }}
                />

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
                      <div className="space-y-4">
                        {activeTool.name === 'Resize' && (
                          <>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Width</label>
                              <input
                                type="number"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                value={toolSettings.width || ''}
                                onChange={(e) => setToolSettings({ ...toolSettings, width: e.target.value })}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Height</label>
                              <input
                                type="number"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                value={toolSettings.height || ''}
                                onChange={(e) => setToolSettings({ ...toolSettings, height: e.target.value })}
                              />
                            </div>
                          </>
                        )}
                        {activeTool.name === 'Rotate' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Angle</label>
                            <input
                              type="number"
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                              value={toolSettings.angle || 90}
                              onChange={(e) => setToolSettings({ ...toolSettings, angle: e.target.value })}
                            />
                          </div>
                        )}
                        {activeTool.name === 'Format' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Format</label>
                            <select
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                              value={toolSettings.format || 'png'}
                              onChange={(e) => setToolSettings({ ...toolSettings, format: e.target.value })}
                            >
                              <option value="png">PNG</option>
                              <option value="jpg">JPG</option>
                              <option value="jpeg">JPEG</option>
                              <option value="webp">WEBP</option>
                            </select>
                          </div>
                        )}
                        {activeTool.name === 'Filters' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Filter</label>
                            <select
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                              value={toolSettings.filter || 'grayscale'}
                              onChange={(e) => setToolSettings({ ...toolSettings, filter: e.target.value })}
                            >
                              <option value="grayscale">Grayscale</option>
                              <option value="sepia">Sepia</option>
                            </select>
                          </div>
                        )}
                        {activeTool.name === 'Remove Background' && (
                          <div className="text-sm text-gray-500">No settings required. Just click Apply!</div>
                        )}
                        {activeTool.name === 'Crop' && (
                          <>
                            <div className="mb-2 text-xs text-gray-500">
                              Image size: {originalImageSize.width} x {originalImageSize.height} px
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Left</label>
                              <input
                                type="number"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                value={toolSettings.left || ''}
                                min={0}
                                max={toolSettings.right || originalImageSize.width}
                                onChange={(e) => setToolSettings({ ...toolSettings, left: e.target.value })}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Top</label>
                              <input
                                type="number"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                value={toolSettings.top || ''}
                                min={0}
                                max={toolSettings.bottom || originalImageSize.height}
                                onChange={(e) => setToolSettings({ ...toolSettings, top: e.target.value })}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Right</label>
                              <input
                                type="number"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                value={toolSettings.right || ''}
                                min={toolSettings.left || 0}
                                max={originalImageSize.width}
                                onChange={(e) => setToolSettings({ ...toolSettings, right: e.target.value })}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Bottom</label>
                              <input
                                type="number"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                value={toolSettings.bottom || ''}
                                min={toolSettings.top || 0}
                                max={originalImageSize.height}
                                onChange={(e) => setToolSettings({ ...toolSettings, bottom: e.target.value })}
                              />
                            </div>
                          </>
                        )}
                        {activeTool.name === 'Watermark' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Watermark Text</label>
                            <input
                              type="text"
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                              value={toolSettings.text || ''}
                              onChange={(e) => setToolSettings({ ...toolSettings, text: e.target.value })}
                            />
                          </div>
                        )}
                        {activeTool.name === 'Compress' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Quality (1-100)</label>
                            <input
                              type="number"
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                              value={toolSettings.quality || 75}
                              onChange={(e) => setToolSettings({ ...toolSettings, quality: e.target.value })}
                            />
                          </div>
                        )}
                        {activeTool.name === 'Flip' && (
                          <div className="text-sm text-gray-500">No settings required. Just click Apply!</div>
                        )}
                        {activeTool.name === 'Mirror' && (
                          <div className="text-sm text-gray-500">No settings required. Just click Apply!</div>
                        )}
                      </div>

                      <div className="mt-6">
                        <button
                          onClick={() => handleTransform(activeTool.name, toolSettings)}
                          disabled={isProcessing || isCropInvalid}
                          className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                        >
                          {isProcessing ? 'Processing...' : 'Apply'}
                        </button>
                        <button
                          onClick={handleSave}
                          disabled={isProcessing || !transformationQueue.length}
                          className="w-full mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
                        >
                          {isProcessing ? 'Saving...' : 'Save All Transformations'}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {transformationQueue.length > 0 && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                    <h3 className="font-medium text-gray-900 mb-2">Queued Transformations</h3>
                    <ul className="list-disc list-inside text-sm text-gray-700">
                      {transformationQueue.map((transformation, index) => (
                        <li key={index}>
                          {transformation.type} - {JSON.stringify(transformation.options)}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
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