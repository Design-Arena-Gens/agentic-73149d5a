import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { UserRole, canManageRole } from '@/lib/auth';
import { ObjectId } from 'mongodb';

export async function GET(req: NextRequest) {
  try {
    const userRole = req.headers.get('x-user-role') as UserRole;

    if (!['OWNER', 'ADMIN', 'MANAGER'].includes(userRole)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const db = await getDatabase();
    const usersCollection = db.collection('users');

    const users = await usersCollection
      .find({}, { projection: { password: 0 } })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { userId, role } = await req.json();
    const currentUserRole = req.headers.get('x-user-role') as UserRole;
    const currentUserId = req.headers.get('x-user-id');

    if (!['OWNER', 'ADMIN'].includes(currentUserRole)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    if (!canManageRole(currentUserRole, role as UserRole)) {
      return NextResponse.json({ error: 'Cannot assign this role' }, { status: 403 });
    }

    const db = await getDatabase();
    const usersCollection = db.collection('users');

    const targetUser = await usersCollection.findOne({ _id: new ObjectId(userId) });
    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (targetUser.email === 'hemng702@gmail.com' && currentUserId !== userId) {
      return NextResponse.json({ error: 'Cannot modify owner account' }, { status: 403 });
    }

    await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { role, updatedAt: new Date() } }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating user role:', error);
    return NextResponse.json({ error: 'Failed to update user role' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const currentUserRole = req.headers.get('x-user-role') as UserRole;
    const currentUserId = req.headers.get('x-user-id');

    if (currentUserRole !== UserRole.OWNER) {
      return NextResponse.json({ error: 'Only owner can delete users' }, { status: 403 });
    }

    const db = await getDatabase();
    const usersCollection = db.collection('users');

    const targetUser = await usersCollection.findOne({ _id: new ObjectId(userId!) });
    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (targetUser.email === 'hemng702@gmail.com') {
      return NextResponse.json({ error: 'Cannot delete owner account' }, { status: 403 });
    }

    await usersCollection.deleteOne({ _id: new ObjectId(userId!) });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}
