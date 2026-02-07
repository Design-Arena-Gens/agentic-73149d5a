import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export async function GET(req: NextRequest) {
  try {
    const userRole = req.headers.get('x-user-role');

    if (!['OWNER', 'ADMIN', 'MANAGER', 'STAFF'].includes(userRole || '')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const db = await getDatabase();
    const usersCollection = db.collection('users');
    const contentCollection = db.collection('content');
    const viewLogsCollection = db.collection('viewLogs');

    const [totalUsers, totalContent, totalViews, recentViews] = await Promise.all([
      usersCollection.countDocuments(),
      contentCollection.countDocuments(),
      contentCollection.aggregate([
        { $group: { _id: null, totalViews: { $sum: '$views' } } }
      ]).toArray(),
      viewLogsCollection.find()
        .sort({ timestamp: -1 })
        .limit(100)
        .toArray()
    ]);

    const topContent = await contentCollection
      .find()
      .sort({ views: -1 })
      .limit(10)
      .toArray();

    return NextResponse.json({
      totalUsers,
      totalContent,
      totalViews: totalViews[0]?.totalViews || 0,
      topContent,
      recentViews
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
