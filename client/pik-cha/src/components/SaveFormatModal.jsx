import { useState } from 'react';

function SaveFormatModal({ imageUrl, onClose, onDownload }) {
  const [format, setFormat] = useState('jpeg');
  const [quality, setQuality] = useState(90);
  const [width, setWidth] = useState(1024);
  const [height, setHeight] = useState(790);
  const [qualityOption, setQualityOption] = useState('HIGH');
  const [compress, setCompress] = useState(false); // ✅ NEW

  const fileSize = '71.8kb'; // Ideally calculated dynamically

  const handleDownload = () => {
    onDownload({
      format: format.toLowerCase(),
      quality,
      width,
      height,
      compress, // ✅ NEW
    });
    onClose();
  };

  const formatOptions = [
    { id: 'jpeg', name: 'JPEG', description: 'Similar to JPG, used widely for photos', recommended: true },
    { id: 'png', name: 'PNG', description: 'Large and lossless, ideal for icons and graphics' },
    { id: 'jpg', name: 'JPG', description: 'Small files perfect for photos and sharing' },
    { id: 'gif', name: 'GIF', description: 'Best for animations or simple graphics' }
  ];

  const handleQualityPresetClick = (preset) => {
    setQualityOption(preset);
    switch (preset) {
      case 'LOW': setQuality(30); break;
      case 'MED': setQuality(60); break;
      case 'HIGH': setQuality(90); break;
      default: setQuality(90);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-6 rounded-lg w-[800px] text-white shadow-lg relative">
        <h2 className="text-xl font-semibold mb-4 text-center">Save</h2>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">✕</button>

        <div className="flex gap-6">
          {/* Preview */}
          <div className="flex flex-col items-center w-1/3">
            <div className="mb-4 w-full">
              <img src={imageUrl} alt="Preview" className="w-full h-auto object-contain rounded" />
            </div>
            <div className="text-center text-gray-400 text-sm w-full">
              <div>Format: {format}, size: {fileSize}</div>
              <div>{width} x {height}px</div>
            </div>
          </div>

          {/* Format options */}
          <div className="w-2/3">
            {formatOptions.map((option) => (
              <div
                key={option.id}
                onClick={() => setFormat(option.id)}
                className={`flex items-center p-4 rounded-md mb-2 cursor-pointer
                  ${format === option.id ? 'bg-blue-900 border border-blue-700' : 'bg-gray-800 hover:bg-gray-700'}`}
              >
                <div className="flex items-center justify-center w-8 h-8 mr-3">
                  {option.id === 'jpeg' && <div className="text-blue-400">📸</div>}
                  {option.id === 'png' && <div className="text-blue-400">🖼️</div>}
                  {option.id === 'jpg' && <div className="text-blue-400">📷</div>}
                  {option.id === 'gif' && <div className="text-blue-400">🎞️</div>}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <div className="font-medium">{option.name}</div>
                    {option.recommended && (
                      <span className="bg-yellow-600 text-xs py-0.5 px-2 rounded text-white">
                        Recommend
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-400">{option.description}</div>
                </div>
              </div>
            ))}

            {/* Quality + Resize settings for JPG/JPEG */}
            {(format === 'jpg' || format === 'jpeg') && (
              <div className="mt-4 bg-blue-900 p-4 rounded-md border border-blue-700">
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Quality</span>
                  <span>{quality}%</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={100}
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full mb-4"
                />

                <div className="flex gap-1 mb-4">
                  <button
                    onClick={() => handleQualityPresetClick('LOW')}
                    className={`flex-1 py-2 rounded ${qualityOption === 'LOW' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                  >
                    LOW
                  </button>
                  <button
                    onClick={() => handleQualityPresetClick('MED')}
                    className={`flex-1 py-2 rounded ${qualityOption === 'MED' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                  >
                    MED
                  </button>
                  <button
                    onClick={() => handleQualityPresetClick('HIGH')}
                    className={`flex-1 py-2 rounded ${qualityOption === 'HIGH' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                  >
                    HIGH
                  </button>
                </div>

                <div className="mt-2 grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 text-sm">Width</label>
                    <input
                      type="number"
                      value={width}
                      onChange={(e) => setWidth(Number(e.target.value))}
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm">Height</label>
                    <input
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(Number(e.target.value))}
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                    />
                  </div>
                </div>

                {/* ✅ Compress toggle */}
                <div className="mt-4">
                  <label className="inline-flex items-center text-sm">
                    <input
                      type="checkbox"
                      checked={compress}
                      onChange={() => setCompress(!compress)}
                      className="mr-2 w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded"
                    />
                    Enable compression
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button onClick={onClose} className="px-5 py-2 bg-gray-700 text-white rounded hover:bg-gray-600">
            Cancel
          </button>
          <button onClick={handleDownload} className="px-5 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Download
          </button>
        </div>
      </div>
    </div>
  );
}

export default SaveFormatModal;
