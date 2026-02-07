'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';

const genres = [
  'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror',
  'Mystery', 'Romance', 'Sci-Fi', 'Slice of Life', 'Sports', 'Thriller'
];

const serverTypes = ['GOOGLE_DRIVE', 'VIDMOLY', 'CUSTOM'];

export default function AddContent() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    type: 'MOVIE',
    description: '',
    thumbnail: '',
    banner: '',
    trailer: '',
    genres: [] as string[],
    releaseYear: new Date().getFullYear(),
    rating: 13,
    duration: 0,
    videoUrl: '',
    serverType: 'GOOGLE_DRIVE',
    trending: false,
    featured: false,
  });

  const [seasons, setSeasons] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleGenre = (genre: string) => {
    setFormData((prev) => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter((g) => g !== genre)
        : [...prev.genres, genre],
    }));
  };

  const addSeason = () => {
    setSeasons([...seasons, { seasonNumber: seasons.length + 1, episodes: [] }]);
  };

  const addEpisode = (seasonIndex: number) => {
    const newSeasons = [...seasons];
    newSeasons[seasonIndex].episodes.push({
      id: crypto.randomUUID(),
      episodeNumber: newSeasons[seasonIndex].episodes.length + 1,
      title: '',
      description: '',
      thumbnail: '',
      videoUrl: '',
      serverType: 'GOOGLE_DRIVE',
      duration: 0,
      views: 0,
      releaseDate: new Date(),
      introStart: 0,
      introEnd: 0,
    });
    setSeasons(newSeasons);
  };

  const updateEpisode = (seasonIndex: number, episodeIndex: number, field: string, value: any) => {
    const newSeasons = [...seasons];
    newSeasons[seasonIndex].episodes[episodeIndex][field] = value;
    setSeasons(newSeasons);
  };

  const removeEpisode = (seasonIndex: number, episodeIndex: number) => {
    const newSeasons = [...seasons];
    newSeasons[seasonIndex].episodes.splice(episodeIndex, 1);
    setSeasons(newSeasons);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userId = localStorage.getItem('userId');
      const userRole = localStorage.getItem('userRole');

      const contentData = {
        ...formData,
        ...(formData.type === 'SERIES' && { seasons }),
      };

      const res = await fetch('/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId!,
          'x-user-role': userRole!,
        },
        body: JSON.stringify(contentData),
      });

      if (res.ok) {
        router.push('/admin/content');
      } else {
        alert('Failed to add content');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error adding content:', error);
      alert('Failed to add content');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark">
      <Navbar />
      <div className="pt-24 px-8 md:px-16 pb-12">
        <h1 className="text-4xl font-bold text-white mb-8">Add Content</h1>

        <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
          <div>
            <label className="block text-white font-semibold mb-2">Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-white font-semibold mb-2">Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="MOVIE">Movie</option>
              <option value="SERIES">Series</option>
            </select>
          </div>

          <div>
            <label className="block text-white font-semibold mb-2">Description</label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white font-semibold mb-2">Thumbnail URL</label>
              <input
                type="url"
                required
                value={formData.thumbnail}
                onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-white font-semibold mb-2">Banner URL</label>
              <input
                type="url"
                required
                value={formData.banner}
                onChange={(e) => setFormData({ ...formData, banner: e.target.value })}
                className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-white font-semibold mb-2">Trailer URL (Optional)</label>
            <input
              type="url"
              value={formData.trailer}
              onChange={(e) => setFormData({ ...formData, trailer: e.target.value })}
              className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-white font-semibold mb-2">Genres</label>
            <div className="grid grid-cols-4 gap-3">
              {genres.map((genre) => (
                <button
                  key={genre}
                  type="button"
                  onClick={() => toggleGenre(genre)}
                  className={`px-4 py-2 rounded-lg font-semibold transition ${
                    formData.genres.includes(genre)
                      ? 'bg-primary text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-white font-semibold mb-2">Release Year</label>
              <input
                type="number"
                required
                value={formData.releaseYear}
                onChange={(e) => setFormData({ ...formData, releaseYear: parseInt(e.target.value) })}
                className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-white font-semibold mb-2">Rating</label>
              <input
                type="number"
                required
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            {formData.type === 'MOVIE' && (
              <div>
                <label className="block text-white font-semibold mb-2">Duration (min)</label>
                <input
                  type="number"
                  required
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            )}
          </div>

          {formData.type === 'MOVIE' && (
            <div>
              <label className="block text-white font-semibold mb-2">Video URL</label>
              <input
                type="url"
                required
                value={formData.videoUrl}
                onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Google Drive link, Vidmoly link, or custom embed URL"
              />
            </div>
          )}

          {formData.type === 'MOVIE' && (
            <div>
              <label className="block text-white font-semibold mb-2">Server Type</label>
              <select
                value={formData.serverType}
                onChange={(e) => setFormData({ ...formData, serverType: e.target.value })}
                className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {serverTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex space-x-4">
            <label className="flex items-center space-x-2 text-white">
              <input
                type="checkbox"
                checked={formData.trending}
                onChange={(e) => setFormData({ ...formData, trending: e.target.checked })}
                className="w-5 h-5"
              />
              <span>Trending</span>
            </label>
            <label className="flex items-center space-x-2 text-white">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-5 h-5"
              />
              <span>Featured</span>
            </label>
          </div>

          {formData.type === 'SERIES' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Seasons & Episodes</h2>
                <button
                  type="button"
                  onClick={addSeason}
                  className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                >
                  Add Season
                </button>
              </div>

              {seasons.map((season, seasonIndex) => (
                <div key={seasonIndex} className="bg-gray-800 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white">
                      Season {season.seasonNumber}
                    </h3>
                    <button
                      type="button"
                      onClick={() => addEpisode(seasonIndex)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                    >
                      Add Episode
                    </button>
                  </div>

                  <div className="space-y-4">
                    {season.episodes.map((episode: any, episodeIndex: number) => (
                      <div key={episode.id} className="bg-gray-900 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-white font-semibold">
                            Episode {episode.episodeNumber}
                          </h4>
                          <button
                            type="button"
                            onClick={() => removeEpisode(seasonIndex, episodeIndex)}
                            className="text-red-400 hover:text-red-300"
                          >
                            Remove
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <input
                            type="text"
                            placeholder="Episode Title"
                            value={episode.title}
                            onChange={(e) => updateEpisode(seasonIndex, episodeIndex, 'title', e.target.value)}
                            className="px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                          <input
                            type="number"
                            placeholder="Duration (min)"
                            value={episode.duration}
                            onChange={(e) => updateEpisode(seasonIndex, episodeIndex, 'duration', parseInt(e.target.value))}
                            className="px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>

                        <textarea
                          placeholder="Episode Description"
                          value={episode.description}
                          onChange={(e) => updateEpisode(seasonIndex, episodeIndex, 'description', e.target.value)}
                          rows={2}
                          className="w-full mt-4 px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />

                        <input
                          type="url"
                          placeholder="Thumbnail URL"
                          value={episode.thumbnail}
                          onChange={(e) => updateEpisode(seasonIndex, episodeIndex, 'thumbnail', e.target.value)}
                          className="w-full mt-4 px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />

                        <input
                          type="url"
                          placeholder="Video URL (Google Drive, Vidmoly, etc.)"
                          value={episode.videoUrl}
                          onChange={(e) => updateEpisode(seasonIndex, episodeIndex, 'videoUrl', e.target.value)}
                          className="w-full mt-4 px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />

                        <select
                          value={episode.serverType}
                          onChange={(e) => updateEpisode(seasonIndex, episodeIndex, 'serverType', e.target.value)}
                          className="w-full mt-4 px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          {serverTypes.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>

                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <input
                            type="number"
                            placeholder="Intro Start (seconds)"
                            value={episode.introStart}
                            onChange={(e) => updateEpisode(seasonIndex, episodeIndex, 'introStart', parseInt(e.target.value))}
                            className="px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                          <input
                            type="number"
                            placeholder="Intro End (seconds)"
                            value={episode.introEnd}
                            onChange={(e) => updateEpisode(seasonIndex, episodeIndex, 'introEnd', parseInt(e.target.value))}
                            className="px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Content'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-700 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
