import React, { useState } from 'react';
import { useImages } from '../store/ImageContext';
import toast from 'react-hot-toast';

function TransformModal({ imageId, onClose }) {
  const { transformImage } = useImages();
  const [loading, setLoading] = useState(false);
  const [transformations, setTransformations] = useState({
    type: 'resize',
    options: {
      width: 800,
      height: 600,
      quality: 80,
      angle: 0,
      filter: 'none',
      watermark: '',
      format: 'JPEG'
    }
  });

  const handleTransform = async () => {
    try {
      setLoading(true);
      await transformImage(imageId, transformations);
      toast.success('Image transformed successfully!');
      onClose();
    } catch (err) {
      toast.error('Transformation failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateOptions = (key, value) => {
    setTransformations(prev => ({
      ...prev,
      options: {
        ...prev.options,
        [key]: value
      }
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-[600px] max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Transform Image</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Transformation Type</label>
            <select
              value={transformations.type}
              onChange={(e) => setTransformations(prev => ({ ...prev, type: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="resize">Resize</option>
              <option value="crop">Crop</option>
              <option value="rotate">Rotate</option>
              <option value="watermark">Watermark</option>
              <option value="flip">Flip</option>
              <option value="mirror">Mirror</option>
              <option value="compress">Compress</option>
              <option value="format">Change Format</option>
              <option value="filter">Apply Filter</option>
              <option value="remove_bg">Remove Background</option>
            </select>
          </div>

          {transformations.type === 'resize' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Width</label>
                <input
                  type="number"
                  value={transformations.options.width}
                  onChange={(e) => updateOptions('width', parseInt(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Height</label>
                <input
                  type="number"
                  value={transformations.options.height}
                  onChange={(e) => updateOptions('height', parseInt(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {transformations.type === 'rotate' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Angle</label>
              <input
                type="range"
                min="0"
                max="360"
                value={transformations.options.angle}
                onChange={(e) => updateOptions('angle', parseInt(e.target.value))}
                className="mt-1 block w-full"
              />
              <span className="text-sm text-gray-500">{transformations.options.angle}°</span>
            </div>
          )}

          {transformations.type === 'watermark' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Watermark Text</label>
              <input
                type="text"
                value={transformations.options.watermark}
                onChange={(e) => updateOptions('watermark', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          )}

          {transformations.type === 'compress' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Quality</label>
              <input
                type="range"
                min="1"
                max="100"
                value={transformations.options.quality}
                onChange={(e) => updateOptions('quality', parseInt(e.target.value))}
                className="mt-1 block w-full"
              />
              <span className="text-sm text-gray-500">{transformations.options.quality}%</span>
            </div>
          )}

          {transformations.type === 'format' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Format</label>
              <select
                value={transformations.options.format}
                onChange={(e) => updateOptions('format', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="JPEG">JPEG</option>
                <option value="PNG">PNG</option>
                <option value="GIF">GIF</option>
              </select>
            </div>
          )}

          {transformations.type === 'filter' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Filter</label>
              <select
                value={transformations.options.filter}
                onChange={(e) => updateOptions('filter', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="none">None</option>
                <option value="grayscale">Grayscale</option>
                <option value="sepia">Sepia</option>
              </select>
            </div>
          )}
        </div>

        <div className="flex gap-4 mt-6">
          <button
            onClick={handleTransform}
            disabled={loading}
            className="flex-1 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Transforming...' : 'Apply Transformation'}
          </button>
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default TransformModal;
