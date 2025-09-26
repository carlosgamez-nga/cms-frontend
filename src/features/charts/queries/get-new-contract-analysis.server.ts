'use server';

import { getAuthenticatedHeaders } from '@/lib/auth';

// Define the shape of the request parameters
export interface NewContractAnalysisParams {
  baseline_id: string;
  cpt_codes: string[];
}

/**
 * Fetches New Contract analysis data (contract_rate vs offer_rate) from the Django API.
 * This is a SERVER-ONLY function.
 * @param params - An object containing the baseline_id and a list of CPT codes.
 * @returns The analysis data from your Django endpoint.
 */
export const getNewContractAnalysisData = async (params: NewContractAnalysisParams): Promise<any[]> => {
  // If there are no codes to query, don't make an API call.
  if (!params.cpt_codes || params.cpt_codes.length === 0) {
    return [];
  }

  const headers = await getAuthenticatedHeaders();
  if (!headers['Authorization']) {
    throw new Error('User is not authenticated.');
  }

  // The new URL for your analysis endpoint in Django
  const djangoApiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/analysis/new-contract/`;

  try {
    const res = await fetch(djangoApiUrl, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(params), // Send the baseline_id and codes
      cache: 'no-store',
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to fetch New Contract Analysis data: ${res.statusText}`);
    }

    return res.json();
  } catch (error) {
    console.error('Error in getNewContractAnalysisData:', error);
    throw error;
  }
};