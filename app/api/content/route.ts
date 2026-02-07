import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const featured = searchParams.get('featured') === 'true';
    const trending = searchParams.get('trending') === 'true';
    const newEpisodes = searchParams.get('newEpisodes') === 'true';
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';

    const db = await getDatabase();
    const contentCollection = db.collection('content');

    let query: any = {};

    if (featured) {
      query.featured = true;
    }

    if (trending) {
      query.trending = true;
    }

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    let content;

    if (newEpisodes) {
      content = await contentCollection
        .find({ type: 'SERIES' })
        .sort({ updatedAt: -1 })
        .limit(limit)
        .toArray();
    } else {
      content = await contentCollection
        .find(query)
        .sort({ createdAt: -1 })
        .limit(limit)
        .toArray();
    }

    return NextResponse.json({ content });
  } catch (error) {
    console.error('Error fetching content:', error);
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const contentData = await req.json();
    const userId = req.headers.get('x-user-id');
    const userRole = req.headers.get('x-user-role');

    if (!userId || !['OWNER', 'ADMIN', 'MANAGER'].includes(userRole || '')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const db = await getDatabase();
    const contentCollection = db.collection('content');

    const newContent = {
      ...contentData,
      views: 0,
      createdBy: userId,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await contentCollection.insertOne(newContent);

    return NextResponse.json({
      success: true,
      contentId: result.insertedId
    });
  } catch (error) {
    console.error('Error creating content:', error);
    return NextResponse.json({ error: 'Failed to create content' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, ...updateData } = await req.json();
    const userId = req.headers.get('x-user-id');
    const userRole = req.headers.get('x-user-role');

    if (!userId || !['OWNER', 'ADMIN', 'MANAGER'].includes(userRole || '')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const db = await getDatabase();
    const contentCollection = db.collection('content');

    const result = await contentCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...updateData,
          updatedAt: new Date()
        }
      }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating content:', error);
    return NextResponse.json({ error: 'Failed to update content' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const userId = req.headers.get('x-user-id');
    const userRole = req.headers.get('x-user-role');

    if (!userId || !['OWNER', 'ADMIN', 'MANAGER'].includes(userRole || '')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const db = await getDatabase();
    const contentCollection = db.collection('content');

    await contentCollection.deleteOne({ _id: new ObjectId(id!) });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting content:', error);
    return NextResponse.json({ error: 'Failed to delete content' }, { status: 500 });
  }
}
