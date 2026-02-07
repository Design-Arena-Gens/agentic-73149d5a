'use client';

import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Content } from '@/types';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface ContentCarouselProps {
  title: string;
  content: Content[];
}

export default function ContentCarousel({ title, content }: ContentCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -800 : 800;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="px-8 md:px-16 mb-12">
      <h2 className="text-2xl font-bold text-white mb-4">{title}</h2>
      <div className="relative group">
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-black bg-opacity-50 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition hover:bg-opacity-75"
        >
          <FaChevronLeft size={24} />
        </button>
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-black bg-opacity-50 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition hover:bg-opacity-75"
        >
          <FaChevronRight size={24} />
        </button>

        <div
          ref={scrollRef}
          className="flex space-x-4 overflow-x-auto scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {content.map((item) => (
            <div
              key={item._id}
              onClick={() => router.push(`/watch/${item._id}`)}
              className="flex-shrink-0 w-64 cursor-pointer content-card"
            >
              <div className="relative overflow-hidden rounded-lg group">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-96 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white font-semibold text-lg mb-1">
                      {item.title}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-300">
                      <span>{item.releaseYear}</span>
                      <span>•</span>
                      <span>{item.type}</span>
                      <span>•</span>
                      <span>{item.views.toLocaleString()} views</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
