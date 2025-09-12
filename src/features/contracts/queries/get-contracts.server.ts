// Add "use server" at the top to explicitly mark this module as server-only code.
'use server';

import { Contract } from '@/lib/types';
import { getAuthenticatedHeaders } from '@/lib/auth'; // This is safe because this whole file is server-only

/**
 * Fetches contracts directly from the Django API. SERVER-ONLY.
 */
export const getContractsOnServer = async (): Promise<Contract[]> => {
  const headers = await getAuthenticatedHeaders();
  if (!headers['Authorization']) {
    return [];
  }
  // ... rest of the fetch logic ...
  const djangoApiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/my-contracts/`;
  try {
    const res = await fetch(djangoApiUrl, {
      method: 'GET',
      headers,
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.results || data;
  } catch (error) {
    console.error('Error in getContractsOnServer:', error);
    return [];
  }
};

/**
 * Fetches a SINGLE contract by its ID. SERVER-ONLY.
 */
export const getContract = async (contractId: string): Promise<Contract | null> => {
    const headers = await getAuthenticatedHeaders();
    if (!headers['Authorization']) {
      return null;
    }
    // ... rest of the fetch logic ...
    const djangoApiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/contracts/${contractId}/`;
    try {
      const res = await fetch(djangoApiUrl, {
        method: 'GET',
        headers,
        cache: 'no-store',
      });
      if (!res.ok) return null;
      return res.json();
    } catch (error) {
      console.error(`Error in getContract for ID ${contractId}:`, error);
      return null;
    }
};