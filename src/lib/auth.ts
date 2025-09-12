import { cookies } from 'next/headers';

/**
 * Asynchronously retrieves the authentication token from the secure, httpOnly cookie.
 * This is a SERVER-ONLY function.
 */
export const getAuthToken = async (): Promise<string | undefined> => {
  // This function is now async to align with Next.js's dynamic model
  return cookies().get('authToken')?.value;
};

/**
 * Asynchronously creates a standardized Headers object for making authenticated requests to Django.
 */
export const getAuthenticatedHeaders = async (): Promise<HeadersInit> => {
  // MUST await the async getAuthToken function.
  const token = await getAuthToken();

  if (!token) {
    return {};
  }

  return {
    'Authorization': `Token ${token}`,
    'Content-Type': 'application/json',
  };
};