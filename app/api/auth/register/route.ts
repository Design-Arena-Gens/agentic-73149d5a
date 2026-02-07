import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { hashPassword, UserRole } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password, favoriteGenres } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    const db = await getDatabase();
    const usersCollection = db.collection('users');

    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await hashPassword(password);

    let role = UserRole.MEMBER;
    if (email === 'hemng702@gmail.com') {
      role = UserRole.OWNER;
    }

    const newUser = {
      email,
      password: hashedPassword,
      role,
      profiles: [
        {
          id: '1',
          name: 'Profile 1',
          avatar: '/avatars/default-1.png',
          favoriteGenres: favoriteGenres || [],
          watchlist: [],
          continueWatching: []
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await usersCollection.insertOne(newUser);

    return NextResponse.json({
      success: true,
      userId: result.insertedId,
      profile: newUser.profiles[0]
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}
