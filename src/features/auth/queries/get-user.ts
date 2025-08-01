// features/auth/queries/get-user.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetchUserDetails(token: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/user-details`, { // Adjust this URL to your actual user details endpoint
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
      },
      // You might need to add cache: 'no-store' if the user details change frequently
      // cache: 'no-store',
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error fetching user details:', errorData);
      throw new Error(`Failed to fetch user details: ${response.statusText}`);
    }

    const userData = await response.json();
    return userData; // This object should contain 'username', 'email', etc.
  } catch (error) {
    console.error('Error in fetchUserDetails:', error);
    throw error;
  }
}