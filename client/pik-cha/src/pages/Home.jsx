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

const Home = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative isolate overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40">
          <div className="mx-auto max-w-2xl flex-shrink-0 lg:mx-0 lg:max-w-xl lg:pt-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="mt-10 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                Transform Your Images with AI
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Experience the power of AI-driven image transformation. Remove backgrounds, enhance quality,
                and apply stunning effects with just a few clicks.
              </p>
            </motion.div>
            <div className="mt-10 flex items-center gap-x-6">
              <Link
                to="/editor"
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Get Started
              </Link>
              <Link to="/gallery" className="text-sm font-semibold leading-6 text-gray-900">
                View Gallery <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
          <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none"
            >
              <img
                src="/hero-image.jpg"
                alt="App screenshot"
                className="w-[76rem] rounded-md bg-white/5 shadow-2xl ring-1 ring-white/10"
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Feature Section */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">Transform Faster</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to transform your images
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Our powerful tools help you transform images quickly and efficiently, with stunning results every time.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="flex flex-col"
              >
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <feature.icon className="h-5 w-5 flex-none text-indigo-600" aria-hidden="true" />
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-600">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative isolate overflow-hidden"
          >
            <h2 className="mx-auto max-w-2xl text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to transform your images?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-center text-lg leading-8 text-gray-300">
              Join thousands of users who are already using our platform to create stunning images.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                to="/editor"
                className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Get Started
              </Link>
              <Link to="/gallery" className="text-sm font-semibold leading-6 text-white">
                View Gallery <span aria-hidden="true">→</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Home;
