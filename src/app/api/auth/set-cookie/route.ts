// app/api/auth/set-cookie/route.ts
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ message: 'Token is missing' }, { status: 400 });
    }

    // Set the cookie
    cookies().set('authToken', token, {
      httpOnly: true, // Makes the cookie inaccessible to client-side JavaScript
      secure: process.env.NODE_ENV === 'production', // Use secure in production (HTTPS)
      maxAge: 60 * 60 * 24 * 7, // 1 week (adjust as needed)
      path: '/', // The cookie is available across the entire site
      sameSite: 'lax', // Protects against CSRF attacks
    });

    return NextResponse.json({ message: 'Auth token cookie set successfully' }, { status: 200 });

  } catch (error) {
    console.error('Error setting auth cookie:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}