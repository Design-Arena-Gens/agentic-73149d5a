'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { Content } from '@/types';
import { FaArrowLeft } from 'react-icons/fa';

interface VideoPlayerProps {
  content: Content;
  episode?: any;
  onBack: () => void;
}

export default function VideoPlayer({ content, episode, onBack }: VideoPlayerProps) {
  const params = useParams();
  const [videoUrl, setVideoUrl] = useState('');
  const [showSkipIntro, setShowSkipIntro] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    logView();
    setupVideoUrl();

    intervalRef.current = setInterval(() => {
      saveProgress();
    }, 30000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      saveProgress();
    };
  }, [episode]);

  const setupVideoUrl = () => {
    const url = episode ? episode.videoUrl : content.videoUrl;
    const serverType = episode ? episode.serverType : content.serverType;

    if (!url) return;

    if (serverType === 'GOOGLE_DRIVE') {
      const fileId = extractGoogleDriveId(url);
      setVideoUrl(`https://drive.google.com/file/d/${fileId}/preview`);
    } else {
      setVideoUrl(url);
    }
  };

  const extractGoogleDriveId = (url: string): string => {
    const match = url.match(/[-\w]{25,}/);
    return match ? match[0] : url;
  };

  const logView = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const profileId = localStorage.getItem('profileId');

      await fetch(`/api/content/${params.id}/view`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId || '',
          'x-profile-id': profileId || '',
          'x-session-id': crypto.randomUUID(),
        },
        body: JSON.stringify({
          episodeId: episode?.id,
          duration: 0,
          timestamp: 0,
        }),
      });
    } catch (error) {
      console.error('Error logging view:', error);
    }
  };

  const saveProgress = async () => {
    if (currentTime === 0) return;

    try {
      const userId = localStorage.getItem('userId');
      const profileId = localStorage.getItem('profileId');

      await fetch(`/api/content/${params.id}/view`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId || '',
          'x-profile-id': profileId || '',
          'x-session-id': crypto.randomUUID(),
        },
        body: JSON.stringify({
          episodeId: episode?.id,
          duration: currentTime,
          timestamp: currentTime,
        }),
      });
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const handleTimeUpdate = (time: number) => {
    setCurrentTime(time);

    if (episode?.introStart && episode?.introEnd) {
      if (time >= episode.introStart && time <= episode.introEnd) {
        setShowSkipIntro(true);
      } else {
        setShowSkipIntro(false);
      }
    }
  };

  const skipIntro = () => {
    if (episode?.introEnd) {
      setCurrentTime(episode.introEnd);
      setShowSkipIntro(false);
    }
  };

  return (
    <div className="relative w-full h-screen bg-black">
      <button
        onClick={onBack}
        className="absolute top-8 left-8 z-50 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition"
      >
        <FaArrowLeft size={24} />
      </button>

      {showSkipIntro && (
        <button
          onClick={skipIntro}
          className="absolute bottom-24 right-8 z-50 bg-white text-dark px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
        >
          Skip Intro
        </button>
      )}

      <div className="w-full h-full">
        {videoUrl ? (
          <iframe
            src={videoUrl}
            className="w-full h-full"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-white text-xl">No video source available</p>
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-8">
        <h2 className="text-white text-2xl font-bold mb-2">
          {content.title}
          {episode && ` - Episode ${episode.episodeNumber}: ${episode.title}`}
        </h2>
        {episode && (
          <p className="text-gray-300">{episode.description}</p>
        )}
      </div>
    </div>
  );
}
