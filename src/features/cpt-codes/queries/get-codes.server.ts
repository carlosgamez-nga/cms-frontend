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

  const djangoApiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cms-data/`;

  const requestBody = {
    year: params.year,
    carrier_number: params.carrier_number,
    locality: params.locality,
    hcpcs_codes: params.hcpcs_codes,
  };

  console.log(`[CMS] Fetching ${djangoApiUrl} with auth:`, Object.keys(headers as Record<string,string>).join(', '));

  try {
    const res = await fetch(djangoApiUrl, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(requestBody),
      cache: 'no-store',
    });

    if (!res.ok) {
      const errorText = await res.text().catch(() => res.statusText);
      console.error(`getCmsDataForCodes: Django returned ${res.status}:`, errorText);
      throw new Error(`CMS data fetch failed (${res.status}): ${errorText}`);
    }

    return res.json();
  } catch (error) {
    console.error('Error in getCmsDataForCodes:', error);
    throw error;
  }
};