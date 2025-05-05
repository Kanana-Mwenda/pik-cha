// /* Updated Dashboard.js */
// import React, { useState, useEffect, useRef } from 'react';
// import ImageList from '../components/ImageList';
// import ImagePreview from '../components/ImagePreview';
// import { getImageList, deleteImage, uploadImage } from '../services/imageService';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { FaCloudUploadAlt } from 'react-icons/fa';

// const Dashboard = () => {
//   const [images, setImages] = useState([]);
//   const [filteredImages, setFilteredImages] = useState([]);
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [filterBy, setFilterBy] = useState('');
//   const [isLoading, setIsLoading] = useState(true);
//   const [isUploading, setIsUploading] = useState(false);

//   const fileInputRef = useRef(null);

//   useEffect(() => {
//     const loadImages = async () => {
//       try {
//         setIsLoading(true);
//         let imageData = await getImageList();

//         if (!imageData || imageData.length === 0) {
//           imageData = [
//             // fallback images here
//           ];
//         }

//         setImages(imageData);
//         setFilteredImages(imageData);
//       } catch (error) {
//         toast.error('Failed to load images. Please try again later.');
//         console.error('Error loading images:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     loadImages();
//   }, []);

//   useEffect(() => {
//     let result = [...images];
//     if (searchQuery.trim()) {
//       result = result.filter(img => img.name.toLowerCase().includes(searchQuery.toLowerCase()));
//     }
//     if (filterBy) {
//       result = result.filter(img => img.category === filterBy);
//     }
//     setFilteredImages(result);
//   }, [searchQuery, filterBy, images]);

//   const handleImageClick = (image) => {
//     setSelectedImage(image);
//   };

//   const handleClosePreview = () => {
//     setSelectedImage(null);
//   };

//   const handleEditImage = (imageId) => {
//     toast.info(`Edit functionality coming soon for image ID: ${imageId}`);
//   };

//   const handleConfirmDelete = async (imageId) => {
//     try {
//       const success = await deleteImage(imageId);
//       if (success) {
//         toast.success('Image deleted successfully!');
//         setImages(prev => prev.filter(img => img.id !== imageId));
//         if (selectedImage?.id === imageId) setSelectedImage(null);
//       } else {
//         toast.error('Failed to delete image.');
//       }
//     } catch (error) {
//       toast.error('Error occurred while deleting the image.');
//     }
//   };

//   const handleFileChange = async (e) => {
//     const files = e.target.files;
//     if (!files || files.length === 0) return;

//     setIsUploading(true);
//     try {
//       for (let i = 0; i < files.length; i++) {
//         const file = files[i];
//         if (!file.type.startsWith('image/')) {
//           toast.error(`${file.name} is not an image file.`);
//           continue;
//         }

//         const imageUrl = URL.createObjectURL(file);
//         const newId = `${Date.now()}${i}`;
//         const newImage = {
//           id: newId,
//           url: imageUrl,
//           title: file.name.split('.')[0],
//           category: 'uploads',
//           file: file
//         };

//         try {
//           const uploadedImage = await uploadImage(file);
//           if (uploadedImage?.url) newImage.url = uploadedImage.url;
//           if (uploadedImage?.id) newImage.id = uploadedImage.id;
//         } catch {
//           console.log('Using local file reference instead of upload service');
//         }

//         setImages(prev => {
//           const updated = [newImage, ...prev];
//           setFilteredImages(updated);
//           return updated;
//         });

//         toast.success(`${file.name} uploaded successfully!`);
//       }
//     } catch (error) {
//       toast.error('Error uploading images');
//     } finally {
//       setIsUploading(false);
//       if (fileInputRef.current) fileInputRef.current.value = '';
//     }
//   };

//   const handleUploadClick = () => {
//     if (fileInputRef.current) fileInputRef.current.click();
//   };

//   return (
//     <div className="p-6">
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
//         <h1 className="text-2xl font-bold">My Image Dashboard</h1>
//         <div className="mt-3 sm:mt-0">
//           <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" multiple />
//           <button onClick={handleUploadClick} disabled={isUploading} className={`flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors ${isUploading ? 'opacity-70 cursor-not-allowed' : ''}`}>
//             <FaCloudUploadAlt size={20} />
//             {isUploading ? 'Uploading...' : 'Upload Images'}
//           </button>
//         </div>
//       </div>

//       <div className="mb-6 flex flex-col md:flex-row items-center gap-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow-sm">
//         <input type="text" placeholder="Search images..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="border p-2 rounded-md w-full md:w-1/3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none" aria-label="Search images" />
//         <select value={filterBy} onChange={(e) => setFilterBy(e.target.value)} className="border p-2 rounded-md w-full md:w-1/4 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none" aria-label="Filter by category">
//           <option value="">All Categories</option>
//           <option value="nature">Nature</option>
//           <option value="tech">Tech</option>
//           <option value="people">People</option>
//           <option value="architecture">Architecture</option>
//           <option value="uploads">My Uploads</option>
//         </select>
//       </div>

//       {isLoading ? (
//         <p className="text-center py-8 text-gray-500">Loading your images...</p>
//       ) : filteredImages.length === 0 ? (
//         <p className="text-center py-8 text-gray-500">No images found matching your criteria.</p>
//       ) : (
//         <ImageList images={filteredImages} onImageClick={handleImageClick} onEdit={handleEditImage} onDelete={handleConfirmDelete} />
//       )}

//       {selectedImage && (
//         <ImagePreview image={selectedImage} onClose={handleClosePreview} />
//       )}

//       <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
//     </div>
//   );
// };

// export default Dashboard;
