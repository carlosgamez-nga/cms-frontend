// src/app/api/contracts/upload/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getAuthToken } from '@/lib/auth'; // Importing the new async function

// The POST function is already async, which is correct.
export async function POST(request: NextRequest) {
  // --- FIX IS HERE ---
  // You now MUST await the result of your helper function.
  const token = await getAuthToken();
  // --- END OF FIX ---

  if (!token) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  }

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!apiBaseUrl) {
    console.error("CRITICAL: NEXT_PUBLIC_API_BASE_URL is not defined.");
    return NextResponse.json({ error: "Server is misconfigured." }, { status: 500 });
  }

  const djangoApiUrl = `${apiBaseUrl}/api/contracts/`;
  const formData = await request.formData();

  try {
    const djangoResponse = await fetch(djangoApiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
      },
      body: formData,
    });

    const responseData = await djangoResponse.json();
    if (!djangoResponse.ok) {
      return NextResponse.json(responseData, { status: djangoResponse.status });
    }
    return NextResponse.json(responseData, { status: 201 });

  } catch (error) {
    console.error('Error forwarding file upload to Django:', error);
    return NextResponse.json({ error: 'An internal server error occurred.' }, { status: 500 });
  }
}