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
// src/features/contracts/queries/get-contracts.ts



// Assuming you still have 'getContracts' (the one returning '[]' or commented out).
// Ensure it's not being called elsewhere if it's not needed.
export const getContracts = async (): Promise<Contract[]> => {
  return []; // Or whatever you've set it to temporarily to avoid issues
};

// Modify getContract to accept authToken
export const getContract = async (contractId: string, authToken?: string): Promise<Contract | null> => { // <-- ADD authToken PARAMETER
  try {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

    if (!API_BASE_URL) {
      throw new Error("API base URL is not configured for getContract.");
    }

    if (!authToken) {
      console.warn('Authentication token not provided to getContract.');
      return null; // Or throw new Error('Authentication required for getContract.');
    }

    const res = await fetch(
      `${API_BASE_URL}/api/contracts/${contractId}/`, // Assuming this is your Django endpoint for a single user contract
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${authToken}`, // <-- USE THE AUTH TOKEN HERE
        },
      }
    );

    if (!res.ok) {
      if (res.status === 404) {
        console.warn(`Contract with ID ${contractId} not found or not accessible.`);
        return null; // Return null if not found
      }
      const errorData = await res.json().catch(() => ({}));
      console.error('API Error Response (getContract):', errorData);
      throw new Error(
        errorData.detail || errorData.message || `Failed to fetch contract ${contractId}: ${res.status} ${res.statusText}`
      );
    }

    const contractData = await res.json();
    console.log(`Raw API Response (getContract for ID ${contractId}):`, contractData);
    return contractData; // Assuming it returns the single contract object directly

  } catch (error) {
    console.error(`Error in getContract for ID ${contractId}:`, error);
    return null; // Return null on error
  }
};



export const fetchUserContracts = async (authToken?: string): Promise<Contract[]> => { // <-- ADD authToken PARAMETER
  try {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

    if (!API_BASE_URL) {
      throw new Error("API base URL is not configured for fetchUserContracts.");
    }

    // --- IMPORTANT: Use the passed authToken ---
    if (!authToken) { // Check if the token was provided
      console.warn('Authentication token not provided to fetchUserContracts.');
      // You might want to throw an error that your UI can catch to prompt login
      throw new Error('Authentication required. Please log in.');
    }
    // --- END IMPORTANT CHECK ---

    const res = await fetch(
      `${API_BASE_URL}/api/contracts/`, // Assuming this is your endpoint for user contracts
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${authToken}`, // Use the passed authToken
        },
      }
    );

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error('API Error Response (fetchUserContracts):', errorData);
      throw new Error(
        errorData.detail || errorData.message || `Failed to fetch user contracts: ${res.status} ${res.statusText}`
      );
    }

    const apiResponse = await res.json();
    //console.log('Raw API Response (fetchUserContracts):', apiResponse);

    // Assuming your API returns { results: [...] }
    if (!apiResponse || !Array.isArray(apiResponse.results)) {
        console.error('API response did not contain a valid results array:', apiResponse);
        return []; // Return empty array if structure is unexpected
    }
    console.log('Extracting results array:', apiResponse.results);
    return apiResponse.results;

  } catch (error) {
    console.error('Error in fetchUserContracts:', error);
    // Propagate the error so calling component can handle it
    throw error;
  }
};