import { getAuthenticatedHeaders } from '@/lib/auth'; // Using our async, server-side helper
import { User } from '@/lib/types'; // Assuming you have a User type defined

/**
 * Fetches the current user's details directly from the Django API.
 * This is a SERVER-ONLY function for use in Server Components.
 * @returns A Promise that resolves to the User object, or null if not authenticated.
 */
export const getUserDetailsOnServer = async (): Promise<User | null> => {
  // 1. Get the authenticated headers. This handles the cookie logic.
  const headers = await getAuthenticatedHeaders();

  // 2. If no Authorization header, the user is not logged in.
  if (!headers['Authorization']) {
    console.log('getUserDetailsOnServer: No auth token found.');
    return null;
  }

  const djangoApiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user-details/`; // Your Django endpoint for user details

  try {
    // 3. Call Django directly.
    const res = await fetch(djangoApiUrl, {
      method: 'GET',
      headers: headers,
      cache: 'no-store', // User data should always be fresh
    });

    if (!res.ok) {
      console.error('getUserDetailsOnServer: Failed to fetch user details from Django:', res.statusText);
      return null;
    }

    const userData: User = await res.json();
    return userData;

  } catch (error) {
    console.error('Error in getUserDetailsOnServer:', error);
    return null;
  }
};