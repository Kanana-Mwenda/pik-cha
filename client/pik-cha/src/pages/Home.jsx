import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  PhotoIcon,
  SparklesIcon,
  ArrowsPointingOutIcon,
  PaintBrushIcon,
  ArrowPathIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';
import heroDemo from '../assets/hero-demo.jpg';

const features = [
  {
    name: 'AI-Powered Editing',
    description: 'Remove backgrounds, enhance images, and apply smart filters with our advanced AI technology.',
    icon: SparklesIcon,
  },
  {
    name: 'Batch Processing',
    description: 'Transform multiple images at once with our efficient batch processing tools.',
    icon: DocumentDuplicateIcon,
  },
  {
    name: 'Smart Resizing',
    description: 'Resize images while maintaining aspect ratio and quality with our smart algorithms.',
    icon: ArrowsPointingOutIcon,
  },
  {
    name: 'Creative Filters',
    description: 'Apply artistic filters and effects to make your images stand out.',
    icon: PaintBrushIcon,
  },
  {
    name: 'Format Conversion',
    description: 'Convert images between different formats while preserving quality.',
    icon: ArrowPathIcon,
  },
  {
    name: 'Image Gallery',
    description: 'Organize and manage your transformed images in a beautiful gallery interface.',
    icon: PhotoIcon,
  },
];

const lottieUrl = "https://assets2.lottiefiles.com/packages/lf20_2ks3pjua.json";

const Home = () => {
  return (
    <div className="bg-gradient-to-br from-indigo-200 via-purple-200 to-cyan-100 min-h-screen">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-12 flex flex-col md:flex-row items-center gap-12">
        {/* Hero Text */}
        <div className="flex-1 min-w-[300px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold futuristic-heading text-gray-900 mb-6">
              Transform Your Images with AI
            </h1>
            <p className="text-lg text-gray-700 mb-8">
              Experience the power of AI-driven image transformation. Remove backgrounds, enhance quality, and apply stunning effects with just a few clicks.
            </p>
            <div className="flex items-center gap-x-6">
              <Link
                to="/editor"
                className="rounded-md bg-indigo-600 px-5 py-3 text-lg font-semibold text-white shadow-lg hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 pulse transition-all duration-300"
              >
                Get Started
              </Link>
              <Link to="/gallery" className="text-lg font-semibold leading-6 text-indigo-700 hover:underline">
                View Gallery <span aria-hidden="true">→</span>
              </Link>
            </div>
          </motion.div>
        </div>
        {/* Hero Image */}
        <div className="flex-1 flex items-center justify-center min-w-[300px]">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ scale: 1.03 }}
            className="w-full max-w-lg"
          >
            <div className="relative w-full h-80 sm:h-[28rem] md:h-[32rem] flex items-center justify-center">
              <img
                src={heroDemo}
                alt="Before and After AI Background Removal"
                className="w-full h-full object-cover rounded-lg shadow-2xl"
                style={{ objectPosition: 'center' }}
              />
              {/* Vertical Divider */}
              <div className="absolute left-1/2 top-0 h-full w-1 bg-white/80 shadow-lg z-10" style={{transform: 'translateX(-50%)'}}></div>
              {/* Before Label */}
              <div className="absolute left-4 bottom-4 bg-black/70 text-white text-xs md:text-sm font-bold px-3 py-1 rounded-full z-20">BEFORE</div>
              {/* After Label */}
              <div className="absolute right-4 bottom-4 bg-black/70 text-white text-xs md:text-sm font-bold px-3 py-1 rounded-full z-20">AFTER</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Feature Section */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600 mb-2">Transform Faster</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight futuristic-heading text-gray-900 sm:text-4xl">
            Everything you need to transform your images
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-700">
            Our powerful tools help you transform images quickly and efficiently, with stunning results every time.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-12 lg:max-w-none lg:grid-cols-3">
            {features.map((feature, idx) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="flex flex-col glass p-6 shadow-xl hover:scale-105 hover:shadow-2xl transition-all duration-300 group bg-white/80"
              >
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-indigo-700 mb-2">
                  <feature.icon className="h-6 w-6 flex-none text-indigo-400 group-hover:text-pink-400 transition-colors duration-300" aria-hidden="true" />
                  {feature.name}
                </dt>
                <dd className="mt-2 flex flex-auto flex-col text-base leading-7 text-gray-700">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 py-24 sm:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative isolate overflow-hidden max-w-3xl mx-auto text-center rounded-2xl shadow-2xl"
        >
          <h2 className="mx-auto max-w-2xl text-center text-3xl font-bold tracking-tight text-white sm:text-4xl futuristic-heading">
            Ready to transform your images?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-center text-lg leading-8 text-white/90">
            Join thousands of users who are already using our platform to create stunning images.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              to="/editor"
              className="rounded-md bg-white px-5 py-3 text-lg font-bold text-indigo-600 shadow-lg hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white pulse transition-all duration-300"
            >
              Get Started
            </Link>
            <Link to="/gallery" className="text-lg font-semibold leading-6 text-white hover:underline">
              View Gallery <span aria-hidden="true">→</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
