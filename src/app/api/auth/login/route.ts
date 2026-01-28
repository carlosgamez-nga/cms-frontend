// src/app/api/auth/login/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    
    // 1. Construct URL safely
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000';
    // Ensure we don't end up with double slashes or missing slashes
    const cleanBase = baseUrl.replace(/\/$/, ''); 
    const djangoApiUrl = `${cleanBase}/api/api-token-auth/`;

    // 2. Call Django
    const djangoResponse = await fetch(djangoApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    // 3. Debugging Non-JSON responses
    const contentType = djangoResponse.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const errorText = await djangoResponse.text();
      console.error('Django Error (Not JSON):', errorText);
      throw new Error('An unexpected response was received from the authentication server.');
    }

    const data = await djangoResponse.json();

    if (!djangoResponse.ok) {
      const errorMessage = data.non_field_errors?.[0] || 'Invalid credentials.';
      return NextResponse.json({ error: errorMessage }, { status: 401 });
    }

    const token = data.token;
    if (!token) {
      return NextResponse.json({ error: 'Login succeeded but no token was provided.' }, { status: 500 });
    }

    // 4. CRITICAL FIX FOR NEXT.JS 15: Await cookies()
    const cookieStore = await cookies();
    
    cookieStore.set('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week (adjusted to match standard sessions)
      path: '/',
      sameSite: 'lax',
    });

    return NextResponse.json({ message: 'Login successful!' });

  } catch (error: any) {
    console.error('Login API route error:', error);
    const message = error.message || 'An internal server error occurred.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}