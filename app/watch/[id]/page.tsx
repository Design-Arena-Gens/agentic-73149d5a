'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import VideoPlayer from '@/components/VideoPlayer';
import { Content } from '@/types';
import { FaPlus, FaCheck } from 'react-icons/fa';

export default function WatchPage() {
  const params = useParams();
  const router = useRouter();
  const [content, setContent] = useState<Content | null>(null);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState<any>(null);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(true);

  useEffect(() => {
    fetchContent();
  }, [params.id]);

  const fetchContent = async () => {
    try {
      const res = await fetch(`/api/content/${params.id}`);
      const data = await res.json();
      setContent(data.content);

      if (data.content.type === 'SERIES' && data.content.seasons?.[0]?.episodes?.[0]) {
        setSelectedEpisode(data.content.seasons[0].episodes[0]);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching content:', error);
      setLoading(false);
    }
  };

  const toggleWatchlist = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const profileId = localStorage.getItem('profileId');

      if (inWatchlist) {
        await fetch(`/api/watchlist?contentId=${params.id}`, {
          method: 'DELETE',
          headers: {
            'x-user-id': userId!,
            'x-profile-id': profileId!,
          },
        });
      } else {
        await fetch('/api/watchlist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': userId!,
            'x-profile-id': profileId!,
          },
          body: JSON.stringify({ contentId: params.id }),
        });
      }

      setInWatchlist(!inWatchlist);
    } catch (error) {
      console.error('Error updating watchlist:', error);
    }
  };

  const handlePlayClick = () => {
    setShowDetails(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-dark">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-dark">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-white text-xl">Content not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark">
      <Navbar />
      <div className="pt-20">
        {showDetails ? (
          <div>
            <div className="relative h-[70vh]">
              <img
                src={content.banner}
                alt={content.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 px-8 md:px-16 pb-12">
                <h1 className="text-5xl font-bold text-white mb-4">{content.title}</h1>
                <div className="flex items-center space-x-4 mb-6">
                  <button
                    onClick={handlePlayClick}
                    className="bg-white text-dark px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
                  >
                    Play
                  </button>
                  <button
                    onClick={toggleWatchlist}
                    className="bg-gray-600 bg-opacity-70 text-white p-3 rounded-full hover:bg-opacity-50 transition"
                  >
                    {inWatchlist ? <FaCheck size={20} /> : <FaPlus size={20} />}
                  </button>
                </div>
                <div className="flex items-center space-x-4 text-gray-300">
                  <span>{content.releaseYear}</span>
                  <span>•</span>
                  <span>{content.rating}+</span>
                  <span>•</span>
                  <span>{content.views.toLocaleString()} views</span>
                </div>
              </div>
            </div>

            <div className="px-8 md:px-16 py-12">
              <div className="max-w-4xl">
                <p className="text-gray-300 text-lg mb-8">{content.description}</p>
                <div className="space-y-2 mb-8">
                  <p className="text-gray-400">
                    <span className="text-white font-semibold">Genres:</span>{' '}
                    {content.genres.join(', ')}
                  </p>
                  <p className="text-gray-400">
                    <span className="text-white font-semibold">Type:</span> {content.type}
                  </p>
                </div>

                {content.type === 'SERIES' && content.seasons && (
                  <div>
                    <div className="mb-6">
                      <label className="text-white font-semibold mr-4">Season:</label>
                      <select
                        value={selectedSeason}
                        onChange={(e) => setSelectedSeason(Number(e.target.value))}
                        className="bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        {content.seasons.map((season) => (
                          <option key={season.seasonNumber} value={season.seasonNumber}>
                            Season {season.seasonNumber}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {content.seasons
                        .find((s) => s.seasonNumber === selectedSeason)
                        ?.episodes.map((episode) => (
                          <div
                            key={episode.id}
                            onClick={() => {
                              setSelectedEpisode(episode);
                              setShowDetails(false);
                            }}
                            className="bg-gray-800 rounded-lg overflow-hidden cursor-pointer hover:bg-gray-700 transition"
                          >
                            <div className="relative h-48">
                              <img
                                src={episode.thumbnail}
                                alt={episode.title}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition">
                                <div className="text-white text-5xl">▶</div>
                              </div>
                            </div>
                            <div className="p-4">
                              <h3 className="text-white font-semibold mb-2">
                                Episode {episode.episodeNumber}: {episode.title}
                              </h3>
                              <p className="text-gray-400 text-sm line-clamp-2">
                                {episode.description}
                              </p>
                              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                                <span>{episode.duration}m</span>
                                <span>•</span>
                                <span>{episode.views.toLocaleString()} views</span>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <VideoPlayer
            content={content}
            episode={selectedEpisode}
            onBack={() => setShowDetails(true)}
          />
        )}
      </div>
    </div>
  );
}
