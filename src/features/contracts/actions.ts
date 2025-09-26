'use server';

import { getAuthToken } from '@/lib/auth';

// Import the server-side query function and types for the CMS data call
import { getCmsDataForCodes, CmsDataRequestParams } from '@/features/cpt-codes/queries/get-codes.server';

// Import the server-side query function and types for the Payer Price data call
import { getPayerPriceDataOnServer, PayerPriceRequestParams } from '@/features/charts/queries/get-payer-price-data.server';

import { getNewContractAnalysisData, NewContractAnalysisParams } from '@/features/charts/queries/get-new-contract-analysis.server';


// ===================================================================
// ACTION 1: Fetch CMS Data
// ===================================================================
/**
 * A Server Action to fetch CMS data for a given set of parameters.
 * This is a secure function that runs on the server.
 * @param params - An object containing the year, carrier, locality, and codes.
 * @returns An object with either the fetched 'data' or an 'error' message.
 */
export const fetchChartDataAction = async (params: CmsDataRequestParams) => {
  // Server Actions can directly check for authentication.
  const token = await getAuthToken();
  if (!token) {
    return { error: 'Authentication required. Please log in.' };
  }

  try {
    const cmsData = await getCmsDataForCodes(params);
    // The query function already handles errors and returns an array.
    return { data: cmsData };
  } catch (error: any) {
    console.error('Error in fetchChartDataAction:', error);
    return { error: error.message || 'An unexpected error occurred while fetching CMS chart data.' };
  }
};


// ===================================================================
// ACTION 2: Fetch Payer Price Data
// ===================================================================
/**
 * A Server Action to fetch Payer Price data.
 * @param params - The request body payload for the Payer Price API.
 * @returns An object with either the fetched 'data' or an 'error' message.
 */
export const fetchPayerPriceAction = async (params: PayerPriceRequestParams) => {
  const token = await getAuthToken();
  if (!token) {
    return { error: 'Authentication required. Please log in.' };
  }

  try {
    const payerPriceData = await getPayerPriceDataOnServer(params);
    return { data: payerPriceData };
  } catch (error: any) {
    console.error('Error in fetchPayerPriceAction:', error);
    return { error: error.message || 'An unexpected error occurred while fetching Payer Price data.' };
  }
};


// ========== ACTION 3: Fetch New Contract Analysis Data ==========
/**
 * A Server Action to fetch New Contract Analysis data.
 */
export const fetchNewContractAnalysisAction = async (params: NewContractAnalysisParams) => {
  const token = await getAuthToken();
  if (!token) {
    return { error: 'Authentication required.' };
  }

  try {
    const analysisData = await getNewContractAnalysisData(params);
    return { data: analysisData };
  } catch (error: any) {
    console.error('Error in fetchNewContractAnalysisAction:', error);
    return { error: error.message || 'An unexpected error occurred.' };
  }
};