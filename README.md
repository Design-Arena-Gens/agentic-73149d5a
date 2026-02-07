# Anime Streaming Website

A premium anime streaming platform built with Next.js 14, featuring role-based administration, real-time view tracking, and support for multiple video hosting providers.

## 🚀 Live Demo

Visit: **https://agentic-73149d5a.vercel.app**

## ✨ Features

### User Features
- **Hero Banner**: Featured content with high-quality trailers and posters
- **Horizontal Carousels**: Organized content by categories (Trending, New Episodes, etc.)
- **Live Search**: Real-time search results with thumbnails
- **Profile System**: Multi-profile support per account with individual watchlists
- **Watchlist**: Save content to your personal list
- **Continue Watching**: Automatically resume from where you left off
- **Video Player**: Supports Google Drive, Vidmoly, and custom video sources
- **Skip Intro**: Smart intro detection and skip button

### Content Management
- **Movie Support**: Single video content with full metadata
- **Series Support**: Multi-season, multi-episode structure
- **Episode Management**: Add/edit episodes with custom video sources
- **Server Types**: Google Drive, Vidmoly, or custom embed URLs
- **View Counter**: Real-time view tracking per content and episode
- **Trending & Featured**: Mark content for homepage prominence

### Admin Dashboard
- **Role-Based Access Control**:
  - **OWNER**: Full system access (hemng702@gmail.com)
  - **ADMIN**: Manage users and content
  - **MANAGER**: Manage content and regular members
  - **STAFF**: View statistics and moderate content
  - **MEMBER**: Regular user access

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: MongoDB
- **Authentication**: JWT + bcrypt
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

## 📦 Installation

```bash
npm install
npm run dev
```

## 🔐 Default Owner

Email: hemng702@gmail.com (automatically assigned OWNER role)

## 📝 License

MIT License
