// src/app/api/auth/login/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    
    // --- LIKELY PROBLEM AREA ---
    // Double-check this URL. It MUST have a trailing slash if your Django urls.py does.
    const djangoApiUrl = process.env.NEXT_PUBLIC_API_BASE_URL + '/api/api-token-auth/';
    // --- END PROBLEM AREA ---

    const djangoResponse = await fetch(djangoApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    // --- NEW DEBUGGING LOGIC ---
    // Check if the response is JSON before trying to parse it.
    const contentType = djangoResponse.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      // If it's not JSON, log the text content to see the HTML error page.
      const errorText = await djangoResponse.text();
      console.error('Django did not return JSON. Response body:', errorText);
      throw new Error('An unexpected response was received from the authentication server.');
    }
    // --- END DEBUGGING LOGIC ---

    const data = await djangoResponse.json();

    if (!djangoResponse.ok) {
      const errorMessage = data.non_field_errors?.[0] || 'Invalid credentials.';
      return NextResponse.json({ error: errorMessage }, { status: 401 });
    }

    const token = data.token;
    if (!token) {
      return NextResponse.json({ error: 'Login succeeded but no token was provided.' }, { status: 500 });
    }

    cookies().set('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
      sameSite: 'lax',
    });

    return NextResponse.json({ message: 'Login successful!' });

  } catch (error: any) {
    console.error('Login API route error:', error);
    // Return the actual error message if it's a known type
    const message = error.message || 'An internal server error occurred.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}