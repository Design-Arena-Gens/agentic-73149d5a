'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaSearch, FaUser, FaCog } from 'react-icons/fa';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [userRole, setUserRole] = useState('');
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    const role = localStorage.getItem('userRole');
    setUserRole(role || '');

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (searchQuery.length > 2) {
      searchContent();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const searchContent = async () => {
    try {
      const res = await fetch(`/api/content?search=${searchQuery}&limit=5`);
      const data = await res.json();
      setSearchResults(data.content || []);
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push('/auth/login');
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-dark' : 'bg-gradient-to-b from-black to-transparent'
      }`}
    >
      <div className="flex items-center justify-between px-8 py-4">
        <div className="flex items-center space-x-8">
          <Link href="/" className="text-primary text-3xl font-bold">
            AnimeStream
          </Link>
          <div className="hidden md:flex space-x-6">
            <Link href="/" className="text-white hover:text-gray-300 transition">
              Home
            </Link>
            <Link href="/browse" className="text-white hover:text-gray-300 transition">
              Browse
            </Link>
            <Link href="/my-list" className="text-white hover:text-gray-300 transition">
              My List
            </Link>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <div className="relative">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="text-white hover:text-gray-300 transition"
            >
              <FaSearch size={20} />
            </button>
            {searchOpen && (
              <div className="absolute right-0 top-10 w-96 bg-dark border border-gray-700 rounded-lg p-4">
                <input
                  type="text"
                  placeholder="Search anime..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  autoFocus
                />
                {searchResults.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {searchResults.map((content: any) => (
                      <Link
                        key={content._id}
                        href={`/watch/${content._id}`}
                        className="block p-2 hover:bg-gray-800 rounded-lg transition"
                        onClick={() => setSearchOpen(false)}
                      >
                        <div className="flex items-center space-x-3">
                          <img
                            src={content.thumbnail}
                            alt={content.title}
                            className="w-16 h-20 object-cover rounded"
                          />
                          <div>
                            <h4 className="text-white font-semibold">{content.title}</h4>
                            <p className="text-gray-400 text-sm">{content.type}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <Link href="/profile" className="text-white hover:text-gray-300 transition">
            <FaUser size={20} />
          </Link>

          {['OWNER', 'ADMIN', 'MANAGER', 'STAFF'].includes(userRole) && (
            <Link href="/admin" className="text-white hover:text-gray-300 transition">
              <FaCog size={20} />
            </Link>
          )}

          <button
            onClick={handleLogout}
            className="text-white hover:text-gray-300 transition text-sm"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
