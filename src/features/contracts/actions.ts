'use server';

import { getCmsDataForCodes, CmsDataRequestParams } from '@/features/cpt-codes/queries/get-codes.server';
import { getAuthToken } from '@/lib/auth';

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
    if (!cmsData) {
      return { error: 'Failed to retrieve data from the CMS provider.' };
    }
    return { data: cmsData };
  } catch (error) {
    console.error('Error in fetchChartDataAction:', error);
    return { error: 'An unexpected error occurred while fetching chart data.' };
  }
};