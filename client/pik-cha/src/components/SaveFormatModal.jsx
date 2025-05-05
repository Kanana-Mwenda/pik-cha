import { useState } from 'react';

function SaveFormatModal({ imageUrl, onClose, onDownload }) {
  const [format, setFormat] = useState('png');
  const [quality, setQuality] = useState(90);

  const handleDownload = () => {
    onDownload({ format, quality });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-[400px] text-gray-800 shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-center">Save As</h2>

        <div className="flex justify-center mb-4">
          <img
            src={imageUrl}
            alt="Final Preview"
            className="w-48 h-48 object-contain border rounded-md"
          />
        </div>

        <label className="block mb-2 font-semibold">Select Format:</label>
        <select
          value={format}
          onChange={(e) => setFormat(e.target.value)}
          className="w-full p-2 border rounded-md mb-4"
        >
          <option value="png">PNG</option>
          <option value="jpg">JPG</option>
          <option value="webp">WEBP</option>
          <option value="svg">SVG</option>
        </select>

        {(format === 'jpg' || format === 'webp') && (
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Quality: {quality}%</label>
            <input
              type="range"
              min={10}
              max={100}
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="w-full"
            />
          </div>
        )}

        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={handleDownload}
            className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Download
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default SaveFormatModal;
