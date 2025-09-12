import { NextResponse } from 'next/server';
import { getAuthenticatedHeaders } from '@/lib/auth'; // Using your async helper!

export async function GET() {
  // 1. Get the authenticated headers using our centralized, server-side helper.
  const headers = await getAuthenticatedHeaders();

  // 2. If the user isn't logged in, the header will be empty.
  if (!headers['Authorization']) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  }
  
  const djangoApiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/my-contracts/`;

  try {
    // 3. Fetch the data from Django using the secure token.
    const djangoResponse = await fetch(djangoApiUrl, {
      method: 'GET',
      headers: headers,
      cache: 'no-store', // Ensures the data is always fresh for API calls
    });

    const data = await djangoResponse.json();

    if (!djangoResponse.ok) {
      return NextResponse.json({ error: 'Failed to fetch contracts from backend.' }, { status: djangoResponse.status });
    }

    // 4. Return the data from Django to the client component that called this route.
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error in /api/contracts route:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}