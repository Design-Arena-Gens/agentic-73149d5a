'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaUser } from 'react-icons/fa';

export default function ProfileSelect() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const storedProfiles = localStorage.getItem('profiles');
    if (storedProfiles) {
      setProfiles(JSON.parse(storedProfiles));
    } else {
      router.push('/auth/login');
    }
  }, []);

  const selectProfile = (profile: any) => {
    localStorage.setItem('profileId', profile.id);
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-12">Who's watching?</h1>
        <div className="flex justify-center space-x-8">
          {profiles.map((profile) => (
            <div
              key={profile.id}
              onClick={() => selectProfile(profile)}
              className="cursor-pointer group"
            >
              <div className="w-32 h-32 bg-gray-700 rounded-lg flex items-center justify-center mb-4 group-hover:border-4 group-hover:border-white transition">
                <FaUser size={48} className="text-gray-400" />
              </div>
              <p className="text-gray-400 group-hover:text-white transition">
                {profile.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
