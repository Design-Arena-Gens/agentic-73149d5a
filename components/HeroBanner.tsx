'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Content } from '@/types';
import { FaPlay, FaInfoCircle } from 'react-icons/fa';

interface HeroBannerProps {
  content: Content;
}

export default function HeroBanner({ content }: HeroBannerProps) {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const handlePlay = () => {
    router.push(`/watch/${content._id}`);
  };

  return (
    <>
      <div className="relative h-[80vh] w-full">
        <div className="absolute inset-0">
          <img
            src={content.banner}
            alt={content.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-dark via-transparent to-transparent" />
        </div>

        <div className="relative h-full flex items-center px-8 md:px-16">
          <div className="max-w-2xl space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold text-white">
              {content.title}
            </h1>
            <p className="text-lg text-gray-300 line-clamp-3">
              {content.description}
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-300">
              <span>{content.releaseYear}</span>
              <span>•</span>
              <span className="px-2 py-1 border border-gray-400 rounded">
                {content.rating}+
              </span>
              <span>•</span>
              <span>{content.genres.join(', ')}</span>
            </div>
            <div className="flex space-x-4 pt-4">
              <button
                onClick={handlePlay}
                className="flex items-center space-x-2 bg-white text-dark px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
              >
                <FaPlay />
                <span>Play</span>
              </button>
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center space-x-2 bg-gray-600 bg-opacity-70 text-white px-8 py-3 rounded-lg font-semibold hover:bg-opacity-50 transition"
              >
                <FaInfoCircle />
                <span>More Info</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center modal-overlay"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-gray-900 rounded-lg max-w-4xl w-full mx-4 overflow-hidden modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-96">
              <img
                src={content.banner}
                alt={content.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300"
              >
                ✕
              </button>
            </div>
            <div className="p-8">
              <h2 className="text-4xl font-bold text-white mb-4">{content.title}</h2>
              <div className="flex items-center space-x-4 text-sm text-gray-300 mb-6">
                <span className="text-green-500 font-semibold">{content.rating}% Match</span>
                <span>{content.releaseYear}</span>
                <span className="px-2 py-1 border border-gray-400 rounded">
                  {content.rating}+
                </span>
                {content.duration && <span>{content.duration}m</span>}
              </div>
              <p className="text-gray-300 mb-6">{content.description}</p>
              <div className="space-y-2">
                <p className="text-gray-400">
                  <span className="text-white font-semibold">Genres:</span>{' '}
                  {content.genres.join(', ')}
                </p>
                <p className="text-gray-400">
                  <span className="text-white font-semibold">Views:</span> {content.views.toLocaleString()}
                </p>
              </div>
              <div className="mt-6">
                <button
                  onClick={handlePlay}
                  className="flex items-center space-x-2 bg-white text-dark px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
                >
                  <FaPlay />
                  <span>Play Now</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
