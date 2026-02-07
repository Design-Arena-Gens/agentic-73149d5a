import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { episodeId, duration, timestamp } = await req.json();
    const userId = req.headers.get('x-user-id');
    const sessionId = req.headers.get('x-session-id') || crypto.randomUUID();
    const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';

    const db = await getDatabase();
    const contentCollection = db.collection('content');
    const viewLogsCollection = db.collection('viewLogs');

    await contentCollection.updateOne(
      { _id: new ObjectId(params.id) },
      { $inc: { views: 1 } }
    );

    if (episodeId) {
      await contentCollection.updateOne(
        {
          _id: new ObjectId(params.id),
          'seasons.episodes.id': episodeId
        },
        {
          $inc: { 'seasons.$[].episodes.$[ep].views': 1 }
        },
        {
          arrayFilters: [{ 'ep.id': episodeId }]
        }
      );
    }

    await viewLogsCollection.insertOne({
      contentId: params.id,
      episodeId,
      userId,
      sessionId,
      ipAddress,
      userAgent,
      timestamp: new Date(),
      duration: duration || 0
    });

    if (userId && timestamp !== undefined) {
      const usersCollection = db.collection('users');
      const profileId = req.headers.get('x-profile-id');

      await usersCollection.updateOne(
        { _id: new ObjectId(userId), 'profiles.id': profileId },
        {
          $set: {
            'profiles.$.continueWatching': {
              contentId: params.id,
              timestamp,
              episodeId,
              lastWatched: new Date()
            }
          }
        }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error logging view:', error);
    return NextResponse.json({ error: 'Failed to log view' }, { status: 500 });
  }
}
