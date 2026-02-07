import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(req: NextRequest) {
  try {
    const { contentId } = await req.json();
    const userId = req.headers.get('x-user-id');
    const profileId = req.headers.get('x-profile-id');

    if (!userId || !profileId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getDatabase();
    const usersCollection = db.collection('users');

    await usersCollection.updateOne(
      { _id: new ObjectId(userId), 'profiles.id': profileId },
      { $addToSet: { 'profiles.$.watchlist': contentId } }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error adding to watchlist:', error);
    return NextResponse.json({ error: 'Failed to add to watchlist' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const contentId = searchParams.get('contentId');
    const userId = req.headers.get('x-user-id');
    const profileId = req.headers.get('x-profile-id');

    if (!userId || !profileId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getDatabase();
    const usersCollection = db.collection('users');

    await usersCollection.updateOne(
      { _id: new ObjectId(userId), 'profiles.id': profileId },
      { $pull: { 'profiles.$.watchlist': contentId } } as any
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing from watchlist:', error);
    return NextResponse.json({ error: 'Failed to remove from watchlist' }, { status: 500 });
  }
}
