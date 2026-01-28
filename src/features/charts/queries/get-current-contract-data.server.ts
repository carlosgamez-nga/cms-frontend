'use server';

// NOTICE: No import from '@/lib/auth' here!

export interface GetCurrentContractDataParams {
  contractId: number;
  cptCodes: string[];
}

export const getCurrentContractData = async (params: GetCurrentContractDataParams): Promise<any[]> => {
  console.log("\n🛑 🛑 SANITY CHECK: RUNNING HARDCODED VERSION 🛑 🛑");

  // 1. USE THE TOKEN THAT WORKED IN CURL
  const TEST_TOKEN = "cfbc6e83dc2dcdd80e38d0a8c38fbf60b574f88f";

  // 2. FORCE THE URL (Assume localhost:8000 for Django)
  // We manually verify the trailing slash structure
  const baseUrl = "http://127.0.0.1:8000"; 
  const endpoint = `/api/contracts/${params.contractId}/rates/`; 
  const query = `?codes=${params.cptCodes.join(',')}`;
  
  const fullUrl = `${baseUrl}${endpoint}${query}`;

  console.log(`📡 URL: ${fullUrl}`);
  console.log(`🔑 HEADER: Token ${TEST_TOKEN.substring(0, 10)}...`);

  try {
    const res = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // DIRECT STRING - No helper functions
        'Authorization': `Token ${TEST_TOKEN}`
      },
      cache: 'no-store', // Disable Next.js Cache
      next: { revalidate: 0 }
    });

    console.log(`⬅️ STATUS: ${res.status} ${res.statusText}`);

    if (!res.ok) {
      const text = await res.text();
      console.error(`❌ ERROR BODY: ${text}`);
      throw new Error(text);
    }

    const json = await res.json();
    console.log(`✅ SUCCESS! Got ${json.results?.length || json.length} items`);
    return json;

  } catch (error) {
    console.error("💥 CRASH:", error);
    throw error;
  }
};