'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import HeroBanner from '@/components/HeroBanner';
import ContentCarousel from '@/components/ContentCarousel';
import Navbar from '@/components/Navbar';
import { Content } from '@/types';

export default function Home() {
  const [featuredContent, setFeaturedContent] = useState<Content | null>(null);
  const [trendingContent, setTrendingContent] = useState<Content[]>([]);
  const [newEpisodes, setNewEpisodes] = useState<Content[]>([]);
  const [allContent, setAllContent] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const profileId = localStorage.getItem('profileId');

    if (!userId || !profileId) {
      router.push('/auth/login');
      return;
    }

    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const [featuredRes, trendingRes, newEpisodesRes, allRes] = await Promise.all([
        fetch('/api/content?featured=true&limit=1'),
        fetch('/api/content?trending=true&limit=10'),
        fetch('/api/content?newEpisodes=true&limit=10'),
        fetch('/api/content?limit=20')
      ]);

      const featured = await featuredRes.json();
      const trending = await trendingRes.json();
      const episodes = await newEpisodesRes.json();
      const all = await allRes.json();

      setFeaturedContent(featured.content[0] || null);
      setTrendingContent(trending.content || []);
      setNewEpisodes(episodes.content || []);
      setAllContent(all.content || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching content:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-dark">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-dark">
      <Navbar />
      {featuredContent && <HeroBanner content={featuredContent} />}
      <div className="relative z-10 -mt-32 pb-20">
        {trendingContent.length > 0 && (
          <ContentCarousel title="Trending Now" content={trendingContent} />
        )}
        {newEpisodes.length > 0 && (
          <ContentCarousel title="New Episodes" content={newEpisodes} />
        )}
        {allContent.length > 0 && (
          <ContentCarousel title="All Anime" content={allContent} />
        )}
      </div>
    </main>
  );
}
