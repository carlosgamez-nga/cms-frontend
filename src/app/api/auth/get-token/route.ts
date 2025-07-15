// app/api/auth/get-token/route.ts
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const cookieStore = cookies();
    const authToken = cookieStore.get('authToken')?.value;

    if (!authToken) {
      return NextResponse.json({ message: 'Authentication token not found' }, { status: 401 });
    }

    // You could return the token directly, but for security, you might just return a status
    // or a derived value. However, for client-side fetching to Django, the token itself is needed.
    return NextResponse.json({ token: authToken }, { status: 200 });

  } catch (error) {
    console.error('Error in /api/auth/get-token:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}