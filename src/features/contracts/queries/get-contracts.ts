// This file is now safe to import into Client Components because it has no server-only dependencies.

import { Contract } from '@/lib/types';

/**
 * Fetches the user's contracts by calling our internal Next.js API route.
 * Use this in CLIENT COMPONENTS for actions like refreshing data after an update.
 */
export const fetchUserContracts = async (): Promise<Contract[]> => {
  const apiUrl = '/api/contracts'; // Calls the API route
  const response = await fetch(apiUrl);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch contracts.');
  }
  return data.results || data;
};

// You might also have a client-side function to fetch a single contract
export const fetchContractById = async (contractId: string): Promise<Contract> => {
    const apiUrl = `/api/contracts/${contractId}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || `Failed to fetch contract ${contractId}`);
    }
    return data;
}