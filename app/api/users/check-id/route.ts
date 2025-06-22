import { NextResponse } from 'next/server';
import { getUsers } from '@/data/users';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ message: 'ID is required' }, { status: 400 });
    }

    // This is a simple implementation. In a real application, you would query a database.
    const users = getUsers();
    const userExists = users.some(user => user.id.toLowerCase() === id.toLowerCase());

    return NextResponse.json({ exists: userExists });
  } catch (error) {
    console.error('Error checking user ID:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
} 