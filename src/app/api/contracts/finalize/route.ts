// src/app/api/contracts/finalize/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getAuthToken } from '@/lib/auth';

// --- THIS IS THE FIX ---
// This line explicitly tells Next.js to always treat this route as a dynamic function,
// which resolves the static analysis error with the cookies() function.
export const dynamic = 'force-dynamic';
// --- END OF FIX ---

export async function POST(request: NextRequest) {
  // This call will now work without the static analysis error.
  const token = await getAuthToken();

  if (!token) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  }

  const { contractId, effectiveDate, payerName, state } = await request.json();
  const djangoApiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/contracts/finalize/`;

  const payloadToDjango = {
    contract_id: contractId,
    effective_date: effectiveDate,
    payer_name: payerName,
    state: state,
  };
  console.log('Sending this payload to Django for finalization:', payloadToDjango);

  try {
    const djangoResponse = await fetch(djangoApiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payloadToDjango),
    });

    if (!djangoResponse.ok) {
      const errorData = await djangoResponse.json().catch(() => ({
        error: `Request failed with status: ${djangoResponse.status}`,
      }));
      console.error('Django returned an error during finalization:', errorData);
      const errorMessage = errorData.effective_date?.[0] || errorData.contract_id?.[0] || errorData.error || 'Failed to finalize contract.';
      return NextResponse.json({ error: errorMessage }, { status: djangoResponse.status });
    }
    
    const successData = await djangoResponse.json();
    return NextResponse.json(successData);

  } catch (error) {
    console.error('Error in /api/contracts/finalize route:', error);
    return NextResponse.json({ error: 'Internal server error during finalization.' }, { status: 500 });
  }
}