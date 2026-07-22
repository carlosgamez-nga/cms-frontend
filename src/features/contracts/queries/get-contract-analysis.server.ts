'use server';

import { getAuthenticatedHeaders } from '@/lib/auth';

export interface ContractAnalysisRow {
  cpt_code: string;
  description: string | null;
  contract_rate: number;
  rate_formula: string | null;
  market_rate: number | null;
  variance_amount: number | null;
  variance_percent: number | null;
}

/**
 * Fetches the comparison analysis between a contract and market benchmarks.
 */
export const getContractAnalysis = async (contractId: string): Promise<ContractAnalysisRow[]> => {
   const headers = await getAuthenticatedHeaders();
   const reqHeaders = new Headers(headers);
   
   if (!reqHeaders.get('authorization')) {
     return [];
   }

  const djangoApiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/contracts/${contractId}/analysis/`;
  
  try {
    const res = await fetch(djangoApiUrl, {
      method: 'GET',
      headers,
      cache: 'no-store',
    });

    if (!res.ok) {
      console.error('Error fetching contract analysis:', res.statusText);
      return [];
    }

    return await res.json();
  } catch (error) {
    console.error('Error in getContractAnalysis:', error);
    return [];
  }
};
