'use server'; // This directive marks the entire module as server-only code.

import { getAuthenticatedHeaders } from '@/lib/auth';

// 1. This matches your UI form components (dropdown structures)
export interface PayerPriceFormState {
  benchmarkType: string;
  payers: { value: string; title: string; grouping: null }[];
  states: string[];
  billingCodeAndTypes: { value: { code: string; type: string }; title: string; grouping: null; description: null }[];
  taxonomies: { value: string; title: string; grouping: null }[];
  serviceCodes: { value: string; title: string; grouping: null }[];
  yearMonths: { value: { year: number; month: number }; title: string; grouping: null }[];
  counties: string[] | null;
  billingCodeModifiers: string[] | null;
  billingClasses: string[] | null;
  entityTypes: string[] | null;
  includeIndirectNpis: boolean;
  negotiatedTypes: string[] | null;
}

// 2. This EXACTLY matches the curl documentation for the API request payload
export interface PayerPriceApiPayload {
  filters: {
    states: string[];
    taxonomyCodes: string[];
    payers: string[];
    billingCodeAndTypes: { // note: changed from billingCodesAndTypes to match your curl docs
      code: string;
      type: string;
    }[];
    serviceCodes: string[];
    negotiatedTypes: string[];
    billingClasses: string[];
  };
  metrics: {
    aggregations: string[];
  };
  groupBy: string[];
}

/**
 * Fetches Payer Price data by calling your internal Django proxy endpoint.
 * This is a SERVER-ONLY function, designed to be called by a Server Action.
 * @param params - The request body for the Payer Price API.
 * @returns The full JSON response from your Django proxy.
 */
export const getPayerPriceDataOnServer = async (params: PayerPriceRequestParams): Promise<any> => {
  // 1. Securely get the authenticated headers with the user's token.
  const headers = await getAuthenticatedHeaders();
  const reqHeaders = new Headers(headers);
  
  if (!reqHeaders.get('authorization')) {
    throw new Error('User is not authenticated.');
  }

  // 2. Define the correct URL for your Django proxy endpoint.
  const djangoProxyUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/payerprice/create-report/`;

  try {
    // 3. Make the authenticated POST request to your Django backend.
    const res = await fetch(djangoProxyUrl, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(params),
      cache: 'no-store', // Important for dynamic API calls to always get fresh data
    });

    // 4. Handle any errors from your Django proxy.
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      // Throw a specific error message from the backend if available
      throw new Error(errorData.error || `Failed to fetch Payer Price data: ${res.statusText}`);
    }

    // 5. If successful, return the JSON data.
    return res.json();
  } catch (error) {
    console.error('Error in getPayerPriceDataOnServer:', error);
    // Re-throw the error so the Server Action can catch it and report it to the client.
    throw error;
  }
};