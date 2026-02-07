export interface User {
  _id: string;
  email: string;
  password: string;
  role: 'OWNER' | 'ADMIN' | 'MANAGER' | 'STAFF' | 'MEMBER';
  profiles: Profile[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Profile {
  id: string;
  name: string;
  avatar: string;
  favoriteGenres: string[];
  watchlist: string[];
  continueWatching: ContinueWatching[];
}

export interface ContinueWatching {
  contentId: string;
  timestamp: number;
  episodeId?: string;
  lastWatched: Date;
}

export interface Content {
  _id: string;
  title: string;
  type: 'MOVIE' | 'SERIES';
  description: string;
  thumbnail: string;
  banner: string;
  trailer?: string;
  genres: string[];
  releaseYear: number;
  rating: number;
  duration?: number;
  seasons?: Season[];
  videoUrl?: string;
  serverType?: 'GOOGLE_DRIVE' | 'VIDMOLY' | 'CUSTOM';
  views: number;
  trending: boolean;
  featured: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Season {
  seasonNumber: number;
  episodes: Episode[];
}

export interface Episode {
  id: string;
  episodeNumber: number;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  serverType: 'GOOGLE_DRIVE' | 'VIDMOLY' | 'CUSTOM';
  duration: number;
  views: number;
  releaseDate: Date;
  introStart?: number;
  introEnd?: number;
}

export interface ViewLog {
  _id: string;
  contentId: string;
  episodeId?: string;
  userId?: string;
  sessionId: string;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
  duration: number;
}
