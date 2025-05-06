import { useState } from 'react';

function TransformModal({ imageUrl, onClose, onTransform, onSave }) {
  const [rotation, setRotation] = useState(0);
  const [grayscale, setGrayscale] = useState(false);
  const [flipVertical, setFlipVertical] = useState(false);
  const [flipHorizontal, setFlipHorizontal] = useState(false);
  const [mirrorVertical, setMirrorVertical] = useState(false);
  const [mirrorHorizontal, setMirrorHorizontal] = useState(false);
  const [resize, setResize] = useState({ width: 300, height: 300 });
  const [watermark, setWatermark] = useState('');
  const [filter, setFilter] = useState('none');
  const [activeTool, setActiveTool] = useState('none');
  const [history, setHistory] = useState([]);
  const [future, setFuture] = useState([]);
  const [zoom, setZoom] = useState(73);

  const pushToHistory = () => {
    setHistory(prev => [...prev, {
      rotation, grayscale, flipVertical, flipHorizontal, 
      mirrorVertical, mirrorHorizontal, resize, watermark, filter
    }]);
    setFuture([]);
  };

  const undo = () => {
    if (history.length === 0) return;
    const last = history[history.length - 1];
    setFuture(prev => [{
      rotation, grayscale, flipVertical, flipHorizontal, 
      mirrorVertical, mirrorHorizontal, resize, watermark, filter
    }, ...prev]);
    setHistory(prev => prev.slice(0, -1));
    setRotation(last.rotation);
    setGrayscale(last.grayscale);
    setFlipVertical(last.flipVertical);
    setFlipHorizontal(last.flipHorizontal);
    setMirrorVertical(last.mirrorVertical);
    setMirrorHorizontal(last.mirrorHorizontal);
    setResize(last.resize);
    setWatermark(last.watermark);
    setFilter(last.filter);
    setZoom(last.zoom);
  };

  const redo = () => {
    if (future.length === 0) return;
    const next = future[0];
    setHistory(prev => [...prev, {
      rotation, grayscale, flipVertical, flipHorizontal, 
      mirrorVertical, mirrorHorizontal, resize, watermark, filter
    }]);
    setFuture(prev => prev.slice(1));
    setRotation(next.rotation);
    setGrayscale(next.grayscale);
    setFlipVertical(next.flipVertical);
    setFlipHorizontal(next.flipHorizontal);
    setMirrorVertical(next.mirrorVertical);
    setMirrorHorizontal(next.mirrorHorizontal);
    setResize(next.resize);
    setWatermark(next.watermark);
    setFilter(next.filter);
  };

  const handleSave = () => {
    const transformations = {
      rotate: rotation,
      grayscale,
      flipVertical,
      flipHorizontal,
      mirrorVertical,
      mirrorHorizontal,
      resize,
      watermark,
      filter,
    };
    onTransform(transformations);
    onSave();
  };

  const imgStyles = {
    transform: `
      rotate(${rotation}deg) 
      scaleX(${flipHorizontal ? -1 : 1}) 
      scaleY(${flipVertical ? -1 : 1}) 
      ${mirrorHorizontal ? 'rotateY(180deg)' : ''} 
      ${mirrorVertical ? 'rotateX(180deg)' : ''}
    `,
    filter: `${grayscale ? 'grayscale(100%) ' : ''}${filter}`,
    width: `${resize.width}px`,
    height: `${resize.height}px`,
    objectFit: 'cover',
    transition: 'all 0.3s ease',
  };

  // SVG Icon Components
  const IconHome = () => (
    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
      <polyline points="9 22 9 12 15 12 15 22"></polyline>
    </svg>
  );

  const IconMove = () => (
    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none">
      <path d="M5 9l4-4 4 4M5 15l4 4 4-4"></path>
    </svg>
  );

  const IconRotate = () => (
    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none">
      <polyline points="23 4 23 10 17 10"></polyline>
      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
    </svg>
  );

  const IconFilters = () => (
    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none">
      <line x1="4" y1="21" x2="4" y2="14"></line>
      <line x1="4" y1="10" x2="4" y2="3"></line>
      <line x1="12" y1="21" x2="12" y2="12"></line>
      <line x1="12" y1="8" x2="12" y2="3"></line>
      <line x1="20" y1="21" x2="20" y2="16"></line>
      <line x1="20" y1="12" x2="20" y2="3"></line>
      <line x1="1" y1="14" x2="7" y2="14"></line>
      <line x1="9" y1="8" x2="15" y2="8"></line>
      <line x1="17" y1="16" x2="23" y2="16"></line>
    </svg>
  );

  const IconFlip = () => (
    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none">
      <line x1="12" y1="3" x2="12" y2="21"></line>
      <polyline points="17 8 22 12 17 16"></polyline>
      <polyline points="7 8 2 12 7 16"></polyline>
    </svg>
  );

  const IconMirror = () => (
    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none">
      <line x1="3" y1="12" x2="21" y2="12"></line>
      <polyline points="8 7 3 12 8 17"></polyline>
      <polyline points="16 7 21 12 16 17"></polyline>
    </svg>
  );

  const IconCrop = () => (
    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none">
      <path d="M6 2v14a2 2 0 0 0 2 2h14"></path>
      <path d="M18 22V8a2 2 0 0 0-2-2H2"></path>
    </svg>
  );

  const IconResize = () => (
    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    </svg>
  );

  const IconBgRemove = () => (
    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="3" y1="3" x2="21" y2="21"></line>
    </svg>
  );

  const IconWatermark = () => (
    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none">
      <polyline points="4 7 4 4 20 4 20 7"></polyline>
      <line x1="9" y1="20" x2="15" y2="20"></line>
      <line x1="12" y1="4" x2="12" y2="20"></line>
    </svg>
  );

  const IconUndo = () => (
    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none">
      <path d="M3 7v6h6"></path>
      <path d="M21 17a9 9 0 0 0-9-9H3"></path>
    </svg>
  );

  const IconRedo = () => (
    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none">
      <path d="M21 7v6h-6"></path>
      <path d="M3 17a9 9 0 0 1 9-9h9"></path>
    </svg>
  );

  const IconZoomIn = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      <line x1="11" y1="8" x2="11" y2="14"></line>
      <line x1="8" y1="11" x2="14" y2="11"></line>
    </svg>
  );

  const IconZoomOut = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  );

  const IconDownload = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="7 10 12 15 17 10"></polyline>
      <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
  );

  const renderToolOptions = () => {
    switch (activeTool) {
      case 'rotate':
        return (
          <div className="flex flex-col gap-4 w-full p-4">
            <h3 className="text-lg font-semibold">Rotate</h3>
            <button
              onClick={() => { pushToHistory(); setRotation((r) => (r + 90) % 360); }}
              className="bg-blue-500 text-white py-2 px-4 rounded text-sm w-full"
            >
              Rotate 90°
            </button>
            <input
              type="range"
              min="0"
              max="360"
              value={rotation}
              onChange={(e) => setRotation(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="text-sm text-center">{rotation}°</div>
          </div>
        );
      case 'filters':
        return (
          <div className="flex flex-col gap-4 w-full p-4">
            <h3 className="text-lg font-semibold">Filters</h3>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={grayscale}
                onChange={() => { pushToHistory(); setGrayscale(!grayscale); }}
                id="grayscale"
              />
              <label htmlFor="grayscale">Grayscale</label>
            </div>
            <select 
              value={filter} 
              onChange={(e) => { pushToHistory(); setFilter(e.target.value); }} 
              className="border p-2 rounded w-full text-sm"
            >
              <option value="none">None</option>
              <option value="sepia(100%)">Sepia</option>
              <option value="blur(2px)">Blur</option>
              <option value="brightness(1.2)">Brighten</option>
              <option value="contrast(1.5)">High Contrast</option>
            </select>
          </div>
        );
      case 'flip':
        return (
          <div className="flex flex-col gap-4 w-full p-4">
            <h3 className="text-lg font-semibold">Flip</h3>
            <button 
              onClick={() => { pushToHistory(); setFlipVertical(!flipVertical); }} 
              className="bg-green-500 text-white py-2 px-4 rounded text-sm w-full"
            >
              Flip Vertically
            </button>
            <button 
              onClick={() => { pushToHistory(); setFlipHorizontal(!flipHorizontal); }} 
              className="bg-blue-500 text-white py-2 px-4 rounded text-sm w-full"
            >
              Flip Horizontally
            </button>
            <button 
              onClick={() => { 
                pushToHistory(); 
                setFlipVertical(false);
                setFlipHorizontal(false);
              }} 
              className="bg-gray-500 text-white py-2 px-4 rounded text-sm w-full mt-2"
            >
              Reset Flip
            </button>
          </div>
        );
      case 'mirror':
        return (
          <div className="flex flex-col gap-4 w-full p-4">
            <h3 className="text-lg font-semibold">Mirror</h3>
            <button 
              onClick={() => { pushToHistory(); setMirrorVertical(!mirrorVertical); }} 
              className="bg-purple-500 text-white py-2 px-4 rounded text-sm w-full"
            >
              Mirror Vertically
            </button>
            <button 
              onClick={() => { pushToHistory(); setMirrorHorizontal(!mirrorHorizontal); }} 
              className="bg-yellow-500 text-white py-2 px-4 rounded text-sm w-full"
            >
              Mirror Horizontally
            </button>
            <button 
              onClick={() => { 
                pushToHistory(); 
                setMirrorVertical(false);
                setMirrorHorizontal(false);
              }} 
              className="bg-gray-500 text-white py-2 px-4 rounded text-sm w-full mt-2"
            >
              Reset Mirror
            </button>
          </div>
        );
      case 'resize':
        return (
          <div className="flex flex-col gap-4 w-full p-4">
            <h3 className="text-lg font-semibold">Resize</h3>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs block">Width (px)</label>
                <input 
                  type="number" 
                  value={resize.width} 
                  onChange={(e) => setResize({ ...resize, width: +e.target.value })} 
                  className="border p-2 w-full rounded text-sm" 
                />
              </div>
              <div>
                <label className="text-xs block">Height (px)</label>
                <input 
                  type="number" 
                  value={resize.height} 
                  onChange={(e) => setResize({ ...resize, height: +e.target.value })} 
                  className="border p-2 w-full rounded text-sm" 
                />
              </div>
            </div>
            <button 
              onClick={() => { pushToHistory(); setResize({ width: 300, height: 300 }); }} 
              className="bg-gray-500 text-white py-2 px-4 rounded text-sm"
            >
              Reset Size
            </button>
          </div>
        );
      case 'crop':
        return (
          <div className="flex flex-col gap-4 w-full p-4">
            <h3 className="text-lg font-semibold">Crop</h3>
            <p className="text-sm">Crop functionality would be implemented here.</p>
            <button className="bg-blue-500 text-white py-2 px-4 rounded text-sm w-full">
              Apply Crop
            </button>
          </div>
        );
      case 'bgremove':
        return (
          <div className="flex flex-col gap-4 w-full p-4">
            <h3 className="text-lg font-semibold">Background Removal</h3>
            <p className="text-sm">Automatic background removal would be implemented here.</p>
            <button className="bg-purple-500 text-white py-2 px-4 rounded text-sm w-full">
              Remove Background
            </button>
          </div>
        );
      case 'watermark':
        return (
          <div className="flex flex-col gap-4 w-full p-4">
            <h3 className="text-lg font-semibold">Watermark</h3>
            <input 
              type="text" 
              value={watermark} 
              onChange={(e) => setWatermark(e.target.value)} 
              className="border p-2 rounded text-sm w-full" 
              placeholder="Enter watermark text" 
            />
            <div className="grid grid-cols-2 gap-2">
              <button className="bg-gray-500 text-white py-2 px-4 rounded text-sm">
                Position
              </button>
              <button className="bg-gray-500 text-white py-2 px-4 rounded text-sm">
                Opacity
              </button>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex flex-col gap-4 items-center justify-center h-full p-4 text-center">
            <p className="text-gray-500">Select a tool from the left sidebar</p>
          </div>
        );
    }
  };

  const toolButton = (name, icon, toolId) => (
    <button
      onClick={() => setActiveTool(toolId)}
      className={`flex flex-col items-center justify-center p-2 w-full hover:bg-gray-300 ${activeTool === toolId ? 'bg-gray-300' : ''}`}
    >
      {icon}
      <span className="text-xs mt-1">{name}</span>
    </button>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-gray-100 rounded-lg shadow-xl flex flex-col w-full h-full max-w-screen-xl max-h-screen overflow-hidden">
        {/* Header */}
        <div className="bg-gray-800 text-white py-2 px-4 flex items-center justify-between">
          <div className="flex items-center">
            <h2 className="text-lg"> </h2>
          </div>
          <div className="flex items-center gap-4">
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left sidebar - Tools */}
          <div className="bg-gray-200 w-18 flex flex-col items-center border-r border-gray-300">
            {toolButton('Home', <IconHome />, 'home')}
            {toolButton('Move', <IconMove />, 'move')}
            {toolButton('Rotate', <IconRotate />, 'rotate')}
            {toolButton('Filters', <IconFilters />, 'filters')}
            {toolButton('Flip', <IconFlip />, 'flip')}
            {toolButton('Mirror', <IconMirror />, 'mirror')}
            {toolButton('Crop', <IconCrop />, 'crop')}
            {toolButton('Resize', <IconResize />, 'resize')}
            {toolButton('BG Remove', <IconBgRemove />, 'bgremove')}
            {toolButton('Watermark', <IconWatermark />, 'watermark')}
          </div>
          
          {/* Center - Image preview */}
          <div className="flex-1 bg-gray-800 flex flex-col">
            <div className="flex-1 flex items-center justify-center overflow-auto p-4">
              <div className="relative">
                <img 
                  src={imageUrl} 
                  alt="Transform" 
                  style={imgStyles} 
                  className="max-w-full max-h-full"
                />
                {watermark && (
                  <div className="absolute bottom-4 right-4 text-white text-xl font-bold opacity-70">
                    {watermark}
                  </div>
                )}
              </div>
            </div>
            <div className="bg-gray-900 text-white p-2 flex items-center justify-between">
              <div className="text-sm">1024 x 790 px @ {zoom}%</div>
              <div className="flex items-center gap-4">
                <button className="p-2 hover:bg-gray-700 rounded">
                  <IconZoomOut />
                </button>
                <div>{zoom}%</div>
                <button className="p-2 hover:bg-gray-700 rounded">
                  <IconZoomIn />
                </button>
                <div className="flex gap-2 items-center ml-4">
                  <button onClick={undo} className="flex items-center gap-1 bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded">
                    <IconUndo />
                    <span>UNDO</span>
                  </button>
                  <button onClick={redo} className="flex items-center gap-1 bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded">
                    <IconRedo />
                    <span>REDO</span>
                  </button>
                </div>
                <button onClick={onClose} className="bg-gray-700 hover:bg-gray-600 px-4 py-1 rounded ml-4">
                  Close
                </button>
                <button onClick={handleSave} className="bg-blue-500 hover:bg-blue-600 px-4 py-1 rounded flex items-center gap-1">
                  <IconDownload />
                  <span>Save</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right sidebar - Tool options and layers */}
          <div className="bg-gray-200 w-64 flex flex-col border-l border-gray-300">
            <div className="p-2 bg-gray-300 font-semibold">
              {activeTool !== 'none' ? activeTool.charAt(0).toUpperCase() + activeTool.slice(1) : 'Editor'}
            </div>
            <div className="flex-1 overflow-y-auto">
              {renderToolOptions()}
            </div>
            <div className="border-t border-gray-300">
              <div className="p-2 bg-gray-300 font-semibold">Layers</div>
              <div className="p-2">
                <div className="bg-gray-700 text-white p-2 flex items-center justify-between rounded mb-2">
                  <button className="text-xs hover:bg-gray-600 p-1 rounded">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                      <path d="M2 17l10 5 10-5"></path>
                      <path d="M2 12l10 5 10-5"></path>
                    </svg>
                  </button>
                  <button className="text-xs hover:bg-gray-600 p-1 rounded">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                  </button>
                </div>
                <div className="border rounded flex items-center p-1 mb-2 bg-white">
                  <img src={imageUrl} alt="Layer thumbnail" className="w-12 h-12 object-cover rounded" />
                  <div className="ml-2 text-sm">Main Image</div>
                </div>
                <div className="border rounded flex items-center p-1 bg-gray-800">
                  <div className="w-12 h-12 bg-gray-900 rounded flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TransformModal;