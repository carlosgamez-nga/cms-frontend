import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    // 1. Get the new user's credentials from the client-side form.
    const { username, email, password } = await request.json();
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    // --- Step A: Register the User with Django ---
    const registerUrl = `${apiBaseUrl}/api/register/`;
    const registerResponse = await fetch(registerUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });

    const registerData = await registerResponse.json();
    if (!registerResponse.ok) {
      // If registration fails (e.g., username taken), forward Django's validation error.
      const errorMessage = registerData.username?.[0] || registerData.email?.[0] || 'Registration failed.';
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    // --- Step B: Log the New User In to Get a Token ---
    const loginUrl = `${apiBaseUrl}/api/api-token-auth/`;
    const loginResponse = await fetch(loginUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }), // Log in with the same credentials
    });
    
    const loginData = await loginResponse.json();
    if (!loginResponse.ok) {
      // This is an unlikely but important fallback.
      return NextResponse.json({ error: 'User created, but failed to log in.' }, { status: 500 });
    }

    // --- Step C: Securely Set the Cookie ---
    const token = loginData.token;
    if (!token) {
      return NextResponse.json({ error: 'Login succeeded but no token was provided.' }, { status: 500 });
    }

   const cookieStore = await cookies();
    cookieStore.set('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 day expiry
      path: '/',
      sameSite: 'lax',
    });

    // --- Step D: Return Success to the Client ---
    return NextResponse.json({ message: 'User registered and logged in successfully!' });

  } catch (error) {
    console.error('Register API route error:', error);
    return NextResponse.json({ error: 'An internal server error occurred.' }, { status: 500 });
  }
}