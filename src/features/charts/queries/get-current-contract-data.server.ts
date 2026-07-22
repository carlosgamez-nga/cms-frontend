'use server';

// Use Next.js native cookies to get the auth token
import { cookies } from 'next/headers';

// If you are using a custom auth setup or NextAuth, you might import it like this instead:
// import { getAuthToken } from '@/lib/auth';

export interface GetCurrentContractDataParams {
  contractId: number;
  cptCodes: string[];
}

export interface ContractRateResponse {
  cpt_code: string;
  rate: string | number;
}

export const getCurrentContractData = async (params: GetCurrentContractDataParams): Promise<ContractRateResponse[]> => {
  // 1. PULL THE REAL AUTH TOKEN
  // Adjust 'auth_token' to match whatever you named your cookie when the user logged in.
  const cookieStore = await cookies();
  const token =  cookieStore.get('authToken')?.value; 

  if (!token) {
    throw new Error("Unauthorized: No authentication token found.");
  }

  // 2. SET UP THE URL
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"; 
  const endpoint = `/api/contracts/${params.contractId}/rates/`; 
  const fullUrl = `${baseUrl}${endpoint}`;

  try {
    const res = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}` // Injecting the real logged-in token
      },
      cache: 'no-store', 
    });

    if (!res.ok) {
      const text = await res.text();
      console.error(`❌ ERROR FETCHING RATES: ${res.status} ${res.statusText} - ${text}`);
      throw new Error(`Failed to fetch contract data: ${res.statusText}`);
    }

    const json = await res.json();
    
    // Handle both flat arrays and paginated DRF responses
    const allRates: ContractRateResponse[] = Array.isArray(json) ? json : (json.results || []);
    
    // 3. FILTER DOWN TO REQUESTED CPT CODES
    const filteredRates = allRates.filter((rateObj) => 
      params.cptCodes.includes(rateObj.cpt_code)
    );

    return filteredRates;

  } catch (error) {
    console.error("💥 CRASH IN getCurrentContractData:", error);
    throw error;
  }
};