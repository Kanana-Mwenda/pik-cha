import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import * as HeroIcons from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../config';
import axios from 'axios';

const Dashboard = () => {
  const { user } = useAuth();
  const [recentImages, setRecentImages] = useState([]);
  const [stats, setStats] = useState({
    totalImages: 0,
    transformations: 0,
    storageUsed: '0 MB',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You must be logged in to view images");
        return;
      }
      const response = await axios.get(`${API_BASE_URL}/api/images/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRecentImages(response.data.slice(0, 6)); // Get 6 most recent images
      setStats({
        totalImages: response.data.length,
        transformations: response.data.reduce((acc, img) => acc + (img.transformations || 0), 0),
        storageUsed: `${(response.data.reduce((acc, img) => acc + (img.size || 0), 0) / (1024 * 1024)).toFixed(2)} MB`,
      });
    } catch (error) {
      console.error("Error fetching images:", error);
      toast.error("Failed to fetch images");
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      name: 'Upload Image',
      description: 'Upload a new image to transform',
      icon: HeroIcons.ArrowUpTrayIcon,
      link: '/editor',
      color: 'bg-blue-500',
    },
    {
      name: 'AI Tools',
      description: 'Use AI to enhance your images',
      icon: HeroIcons.SparklesIcon,
      link: '/editor?tool=ai',
      color: 'bg-purple-500',
    },
    {
      name: 'View Gallery',
      description: 'Browse all your transformed images',
      icon: HeroIcons.PhotoIcon,
      link: '/gallery',
      color: 'bg-green-500',
    },
  ];

  if (loading) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <HeroIcons.PhotoIcon className="h-12 w-12 text-gray-400 animate-pulse mx-auto" />
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm p-6 mb-8"
        >
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center">
              <HeroIcons.UserCircleIcon className="h-10 w-10 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.username}!</h1>
              <p className="text-gray-600">Here's what's happening with your images</p>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-sm p-6"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <HeroIcons.PhotoIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Images</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalImages}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-sm p-6"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <HeroIcons.SparklesIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Transformations</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.transformations}</p>
                {stats.transformations === 0 && (
                  <p className="text-xs text-gray-400">(Backend does not provide transformation count)</p>
                )}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-sm p-6"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <HeroIcons.ChartBarIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Storage Used</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.storageUsed}</p>
                {stats.storageUsed === '0.00 MB' && (
                  <p className="text-xs text-gray-400">(Backend does not provide image size)</p>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Link
                to={action.link}
                className="block bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className={`p-3 rounded-full ${action.color} w-fit`}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">{action.name}</h3>
                <p className="mt-1 text-sm text-gray-600">{action.description}</p>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Recent Images */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Images</h2>
            <Link
              to="/gallery"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              View all
            </Link>
          </div>

          {recentImages.length === 0 ? (
            <div className="text-center py-12">
              <HeroIcons.PhotoIcon className="h-12 w-12 text-gray-400 mx-auto" />
              <p className="mt-4 text-gray-600">No images yet. Start by uploading one!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {recentImages.map((image) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden"
                >
                  <img
                    src={
                      image.transformed_url
                        ? (image.transformed_url.startsWith('http')
                            ? image.transformed_url
                            : `${API_BASE_URL}${image.transformed_url}`)
                        : (image.original_url.startsWith('http')
                            ? image.original_url
                            : `${API_BASE_URL}${image.original_url}`)
                    }
                    alt={image.filename}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Link
                      to={`/editor?image=${image.id}`}
                      className="text-white text-sm font-medium hover:underline"
                    >
                      Edit
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;