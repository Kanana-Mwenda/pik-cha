import { useState } from 'react';

function TransformModal({ imageUrl, onClose, onTransform, onSave }) {
  const [rotation, setRotation] = useState(0);
  const [grayscale, setGrayscale] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [mirror, setMirror] = useState(false);
  const [resize, setResize] = useState({ width: 300, height: 300 });
  const [watermark, setWatermark] = useState('');
  const [filter, setFilter] = useState('none');
  const [history, setHistory] = useState([]);
  const [future, setFuture] = useState([]);

  const pushToHistory = () => {
    setHistory(prev => [...prev, {
      rotation, grayscale, flipped, mirror, resize, watermark, filter
    }]);
    setFuture([]);
  };

  const undo = () => {
    if (history.length === 0) return;
    const last = history[history.length - 1];
    setFuture(prev => [{
      rotation, grayscale, flipped, mirror, resize, watermark, filter
    }, ...prev]);
    setHistory(prev => prev.slice(0, -1));
    setRotation(last.rotation);
    setGrayscale(last.grayscale);
    setFlipped(last.flipped);
    setMirror(last.mirror);
    setResize(last.resize);
    setWatermark(last.watermark);
    setFilter(last.filter);
  };

  const redo = () => {
    if (future.length === 0) return;
    const next = future[0];
    setHistory(prev => [...prev, {
      rotation, grayscale, flipped, mirror, resize, watermark, filter
    }]);
    setFuture(prev => prev.slice(1));
    setRotation(next.rotation);
    setGrayscale(next.grayscale);
    setFlipped(next.flipped);
    setMirror(next.mirror);
    setResize(next.resize);
    setWatermark(next.watermark);
    setFilter(next.filter);
  };

  const handleSave = () => {
    const transformations = {
      rotate: rotation,
      grayscale,
      flip: flipped,
      mirror,
      resize,
      watermark,
      filter,
    };
    onTransform(transformations);
    onSave();
  };

  const imgStyles = {
    transform: `rotate(${rotation}deg) scaleX(${mirror ? -1 : 1}) scaleY(${flipped ? -1 : 1})`,
    filter: `${grayscale ? 'grayscale(100%) ' : ''}${filter}`,
    width: `${resize.width}px`,
    height: `${resize.height}px`,
    objectFit: 'cover',
    transition: 'all 0.3s ease',
    borderRadius: '8px'
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-gray-200 p-6 rounded-lg w-[600px] lg:w-[800px] xl:w-[1000px] text-gray-800 flex flex-col items-center max-h-[90vh] overflow-y-auto">

        <h2 className="text-3xl font-bold mb-6">Transform Your Image</h2>

        <img src={imageUrl} alt="Transform" style={imgStyles} className="mb-6 border rounded-lg" />

        <div className="grid grid-cols-2 gap-6 w-full mb-6">
          <button onClick={() => { pushToHistory(); setRotation((r) => (r + 90) % 360); }} className="bg-blue-500 text-white py-3 px-6 rounded-lg text-lg">Rotate 90°</button>
          <button onClick={() => { pushToHistory(); setGrayscale((g) => !g); }} className="bg-gray-500 text-white py-3 px-6 rounded-lg text-lg">{grayscale ? 'Remove Grayscale' : 'Grayscale'}</button>
          <button onClick={() => { pushToHistory(); setFlipped((f) => !f); }} className="bg-green-500 text-white py-3 px-6 rounded-lg text-lg">Flip Vertically</button>
          <button onClick={() => { pushToHistory(); setMirror((m) => !m); }} className="bg-yellow-500 text-white py-3 px-6 rounded-lg text-lg">Mirror Horizontally</button>
        </div>

        <div className="w-full flex flex-col gap-4 mb-6">
          <label className="font-semibold text-xl">Resize (px)</label>
          <div className="flex gap-4">
            <input type="number" value={resize.width} onChange={(e) => setResize({ ...resize, width: +e.target.value })} className="border p-3 w-1/2 rounded-lg text-lg" placeholder="Width" />
            <input type="number" value={resize.height} onChange={(e) => setResize({ ...resize, height: +e.target.value })} className="border p-3 w-1/2 rounded-lg text-lg" placeholder="Height" />
          </div>
        </div>

        <div className="w-full flex flex-col gap-4 mb-6">
          <label className="font-semibold text-xl">Watermark</label>
          <input type="text" value={watermark} onChange={(e) => setWatermark(e.target.value)} className="border p-3 rounded-lg text-lg" placeholder="Enter watermark text" />
        </div>

        <div className="w-full flex flex-col gap-4 mb-6">
          <label className="font-semibold text-xl">Filters</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="border p-3 rounded-lg text-lg">
            <option value="none">None</option>
            <option value="sepia(100%)">Sepia</option>
            <option value="blur(2px)">Blur</option>
            <option value="brightness(1.2)">Brighten</option>
            <option value="contrast(1.5)">High Contrast</option>
          </select>
        </div>

        <div className="flex gap-6 mb-6">
          <button onClick={undo} className="px-6 py-3 bg-gray-400 text-white rounded-lg text-lg">Undo</button>
          <button onClick={redo} className="px-6 py-3 bg-gray-400 text-white rounded-lg text-lg">Redo</button>
        </div>

        <div className="flex gap-8 mt-6">
          <button onClick={handleSave} className="px-8 py-3 bg-indigo-600 text-white rounded-lg text-lg">Save</button>
          <button onClick={onClose} className="px-8 py-3 bg-red-500 text-white rounded-lg text-lg">Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default TransformModal;
