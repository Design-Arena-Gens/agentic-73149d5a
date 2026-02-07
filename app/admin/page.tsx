'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (!['OWNER', 'ADMIN', 'MANAGER', 'STAFF'].includes(userRole || '')) {
      router.push('/');
      return;
    }

    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const userRole = localStorage.getItem('userRole');

      const res = await fetch('/api/admin/stats', {
        headers: {
          'x-user-id': userId!,
          'x-user-role': userRole!,
        },
      });

      const data = await res.json();
      setStats(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching stats:', error);
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
    <div className="min-h-screen bg-dark">
      <Navbar />
      <div className="pt-24 px-8 md:px-16 pb-12">
        <h1 className="text-4xl font-bold text-white mb-8">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-gray-400 text-sm font-semibold mb-2">Total Users</h3>
            <p className="text-white text-4xl font-bold">{stats?.totalUsers || 0}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-gray-400 text-sm font-semibold mb-2">Total Content</h3>
            <p className="text-white text-4xl font-bold">{stats?.totalContent || 0}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-gray-400 text-sm font-semibold mb-2">Total Views</h3>
            <p className="text-white text-4xl font-bold">
              {stats?.totalViews?.toLocaleString() || 0}
            </p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-gray-400 text-sm font-semibold mb-2">Recent Views (24h)</h3>
            <p className="text-white text-4xl font-bold">
              {stats?.recentViews?.length || 0}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Link
            href="/admin/content"
            className="bg-primary hover:bg-red-700 text-white p-8 rounded-lg text-center font-semibold text-xl transition"
          >
            Manage Content
          </Link>
          <Link
            href="/admin/users"
            className="bg-primary hover:bg-red-700 text-white p-8 rounded-lg text-center font-semibold text-xl transition"
          >
            Manage Users
          </Link>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-white text-2xl font-bold mb-6">Top Content</h2>
          <div className="space-y-4">
            {stats?.topContent?.map((content: any, index: number) => (
              <div
                key={content._id}
                className="flex items-center justify-between bg-gray-900 p-4 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <span className="text-gray-400 text-2xl font-bold w-8">
                    #{index + 1}
                  </span>
                  <img
                    src={content.thumbnail}
                    alt={content.title}
                    className="w-16 h-20 object-cover rounded"
                  />
                  <div>
                    <h3 className="text-white font-semibold">{content.title}</h3>
                    <p className="text-gray-400 text-sm">{content.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white text-xl font-bold">
                    {content.views.toLocaleString()}
                  </p>
                  <p className="text-gray-400 text-sm">views</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
