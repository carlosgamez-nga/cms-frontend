'use server';

import { getAuthenticatedHeaders } from '@/lib/auth';

// --- Define a type for the dynamic parameters ---
// This improves code readability and provides type safety.
export interface CmsDataRequestParams {
  year: string;
  carrier_number: string;
  locality: string;
  hcpcs_codes: string[];
}

/**
 * Fetches CMS fee schedule data for a given set of parameters via a POST request.
 * This is a SERVER-ONLY function.
 * @param params - An object containing year, carrier_number, locality, and hcpcs_codes.
 * @returns A Promise that resolves to an array of CPT code data objects from the CMS endpoint.
 */
export const getCmsDataForCodes = async (params: CmsDataRequestParams): Promise<any[]> => {
  // If there are no codes to fetch, return an empty array immediately.
  if (!params.hcpcs_codes || params.hcpcs_codes.length === 0) {
    return [];
  }

  const headers = await getAuthenticatedHeaders();
  if (!headers['Authorization']) {
    return [];
  }

  const djangoApiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cms-data/`;

  // The requestBody is now the params object itself.
  const requestBody = {
    year: params.year,
    carrier_number: params.carrier_number,
    locality: params.locality,
    hcpcs_codes: params.hcpcs_codes,
  };

  try {
    const res = await fetch(djangoApiUrl, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(requestBody),
      cache: 'no-store',
    });

    if (!res.ok) {
      console.error('getCmsDataForCodes: Failed to fetch from Django:', res.status, res.statusText);
      return [];
    }

    return res.json();
  } catch (error) {
    console.error('Error in getCmsDataForCodes:', error);
    return [];
  }
};