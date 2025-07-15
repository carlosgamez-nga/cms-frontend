import { Contract } from '@/lib/types';

// Assuming Contract type looks something like this (adjust as per your actual type definition)
// export type Contract = {
//   id: number;
//   title: string;
//   description: string;
//   payer_name: string;
//   state: string;
//   effective_date: string; // Assuming date as string for simplicity
//   file: string; // URL to the file
//   uploaded_at: string;
//   uploaded_by: number; // User ID
// };


// Existing getContracts function (if still needed for other purposes)
export const getContracts = async (): Promise<Contract[]> => {
  try {
    // Note: If BACKEND_URL is meant for server-side only, consider NEXT_PUBLIC_BACKEND_URL for client-side
    const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL; // Use NEXT_PUBLIC if available

    if (!API_BASE_URL) {
      throw new Error("Backend URL is not configured for getContracts.");
    }

    // Simulate delay (for testing)
    await new Promise((res) => setTimeout(res, 2000));

    const res = await fetch(`${API_BASE_URL}/contracts/`); // This hits /contracts/, not user-specific

    if (!res.ok) {
      throw new Error(
        `Failed to fetch all contracts: ${res.status} ${res.statusText}`
      );
    }

    return res.json();
  } catch (error) {
    console.error('Error in getContracts:', error);
    throw error;
  }
};

export const fetchUserContracts = async (): Promise<Contract[]> => {
  try {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

    if (!API_BASE_URL) {
      throw new Error("API base URL is not configured for fetchUserContracts.");
    }

    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      throw new Error('Authentication token not found. Please log in.');
    }

    // REMOVE or comment out this simulation delay if it's still there
    // await new Promise((res) => setTimeout(res, 500));

    const res = await fetch(
      `${API_BASE_URL}/api/my-contracts/`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${authToken}`,
        },
      }
    );

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error('API Error Response during fetchUserContracts:', errorData); // <-- ADD THIS
      throw new Error(
        errorData.detail || errorData.message || `Failed to fetch user contracts: ${res.status} ${res.statusText}`
      );
    }

    const data = await res.json();
    console.log('Fetched User Contracts Data:', data); // <-- ADD THIS
    return data;
  } catch (error) {
    console.error('Error in fetchUserContracts:', error);
    throw error;
  }
};