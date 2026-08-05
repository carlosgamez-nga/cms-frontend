'use server';

import { getAuthenticatedHeaders } from '@/lib/auth';

import { Contract } from '@/lib/types';

export interface DashboardSummary {
  active_contracts: number;
  total_cpt_codes: number;
  expiring_soon: number;
  missing_rate_data: number;
  pending_negotiations: number;
  avg_rate_vs_market: number;
  high_risk_contracts: number;
  payer_distribution: Array<{ name: string; value: number }>;
  market_comparison: Array<{ name: string; market_benchmark: number; contract_rate: number }>;
  top_contracts: Contract[];
}

/**
 * Fetches dashboard aggregate statistics from the Django API.
 */
export const getDashboardSummary = async (): Promise<DashboardSummary | null> => {
const headers = await getAuthenticatedHeaders();
   const reqHeaders = new Headers(headers);
   
   if (!reqHeaders.get('authorization')) {
     return null;
   }

  const djangoApiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/dashboard-summary/`;
  
  try {
    const res = await fetch(djangoApiUrl, {
      method: 'GET',
      headers,
      cache: 'no-store',
    });

    if (!res.ok) {
      console.error('Error fetching dashboard summary:', res.statusText);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error('Error in getDashboardSummary:', error);
    return null;
  }
};
