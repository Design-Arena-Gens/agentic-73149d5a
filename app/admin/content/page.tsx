'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import Link from 'next/link';

export default function ManageContent() {
  const [content, setContent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState('');
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    setUserRole(role || '');

    if (!['OWNER', 'ADMIN', 'MANAGER'].includes(role || '')) {
      router.push('/');
      return;
    }

    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const res = await fetch('/api/content?limit=100');
      const data = await res.json();
      setContent(data.content || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching content:', error);
      setLoading(false);
    }
  };

  const deleteContent = async (id: string) => {
    if (!confirm('Are you sure you want to delete this content?')) return;

    try {
      const userId = localStorage.getItem('userId');

      await fetch(`/api/content?id=${id}`, {
        method: 'DELETE',
        headers: {
          'x-user-id': userId!,
          'x-user-role': userRole,
        },
      });

      fetchContent();
    } catch (error) {
      console.error('Error deleting content:', error);
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
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-white">Manage Content</h1>
          <Link
            href="/admin/content/add"
            className="flex items-center space-x-2 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition"
          >
            <FaPlus />
            <span>Add Content</span>
          </Link>
        </div>

        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-900">
              <tr>
                <th className="text-left text-white font-semibold p-4">Thumbnail</th>
                <th className="text-left text-white font-semibold p-4">Title</th>
                <th className="text-left text-white font-semibold p-4">Type</th>
                <th className="text-left text-white font-semibold p-4">Views</th>
                <th className="text-left text-white font-semibold p-4">Status</th>
                <th className="text-left text-white font-semibold p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {content.map((item) => (
                <tr key={item._id} className="border-t border-gray-700">
                  <td className="p-4">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-16 h-20 object-cover rounded"
                    />
                  </td>
                  <td className="p-4 text-white">{item.title}</td>
                  <td className="p-4 text-gray-400">{item.type}</td>
                  <td className="p-4 text-gray-400">{item.views.toLocaleString()}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      {item.featured && (
                        <span className="px-2 py-1 bg-yellow-500 text-dark text-xs rounded">
                          Featured
                        </span>
                      )}
                      {item.trending && (
                        <span className="px-2 py-1 bg-primary text-white text-xs rounded">
                          Trending
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex space-x-2">
                      <Link
                        href={`/admin/content/edit/${item._id}`}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        <FaEdit size={18} />
                      </Link>
                      <button
                        onClick={() => deleteContent(item._id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <FaTrash size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
