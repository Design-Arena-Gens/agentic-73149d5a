'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';

const roles = ['MEMBER', 'STAFF', 'MANAGER', 'ADMIN', 'OWNER'];

export default function ManageUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserRole, setCurrentUserRole] = useState('');
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    setCurrentUserRole(role || '');

    if (!['OWNER', 'ADMIN', 'MANAGER'].includes(role || '')) {
      router.push('/');
      return;
    }

    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const userRole = localStorage.getItem('userRole');

      const res = await fetch('/api/admin/users', {
        headers: {
          'x-user-id': userId!,
          'x-user-role': userRole!,
        },
      });

      const data = await res.json();
      setUsers(data.users || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const currentUserId = localStorage.getItem('userId');

      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': currentUserId!,
          'x-user-role': currentUserRole,
        },
        body: JSON.stringify({ userId, role: newRole }),
      });

      if (res.ok) {
        fetchUsers();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to update user role');
      }
    } catch (error) {
      console.error('Error updating user role:', error);
      alert('Failed to update user role');
    }
  };

  const deleteUser = async (userId: string, userEmail: string) => {
    if (!confirm(`Are you sure you want to delete user ${userEmail}?`)) return;

    try {
      const currentUserId = localStorage.getItem('userId');

      const res = await fetch(`/api/admin/users?userId=${userId}`, {
        method: 'DELETE',
        headers: {
          'x-user-id': currentUserId!,
          'x-user-role': currentUserRole,
        },
      });

      if (res.ok) {
        fetchUsers();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user');
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
        <h1 className="text-4xl font-bold text-white mb-8">Manage Users</h1>

        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-900">
              <tr>
                <th className="text-left text-white font-semibold p-4">Email</th>
                <th className="text-left text-white font-semibold p-4">Role</th>
                <th className="text-left text-white font-semibold p-4">Profiles</th>
                <th className="text-left text-white font-semibold p-4">Created</th>
                <th className="text-left text-white font-semibold p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-t border-gray-700">
                  <td className="p-4 text-white">{user.email}</td>
                  <td className="p-4">
                    {user.email === 'hemng702@gmail.com' ? (
                      <span className="px-3 py-1 bg-yellow-500 text-dark rounded font-semibold">
                        {user.role}
                      </span>
                    ) : (
                      <select
                        value={user.role}
                        onChange={(e) => updateUserRole(user._id, e.target.value)}
                        disabled={currentUserRole === 'MANAGER' && user.role !== 'MEMBER'}
                        className="px-3 py-1 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                      >
                        {roles.map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                    )}
                  </td>
                  <td className="p-4 text-gray-400">{user.profiles?.length || 0}</td>
                  <td className="p-4 text-gray-400">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    {user.email !== 'hemng702@gmail.com' && currentUserRole === 'OWNER' && (
                      <button
                        onClick={() => deleteUser(user._id, user.email)}
                        className="text-red-400 hover:text-red-300 font-semibold"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Role Permissions</h2>
          <div className="space-y-4 text-gray-300">
            <div>
              <span className="text-yellow-500 font-semibold">OWNER:</span> Full access to everything. Can manage all users, content, and settings.
            </div>
            <div>
              <span className="text-red-500 font-semibold">ADMIN:</span> Can manage users (except owner), add/edit/delete content, and view all stats.
            </div>
            <div>
              <span className="text-blue-500 font-semibold">MANAGER:</span> Can add/edit/delete content and manage regular members.
            </div>
            <div>
              <span className="text-green-500 font-semibold">STAFF:</span> Can view stats and help with content moderation.
            </div>
            <div>
              <span className="text-gray-400 font-semibold">MEMBER:</span> Regular user with no admin access.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
