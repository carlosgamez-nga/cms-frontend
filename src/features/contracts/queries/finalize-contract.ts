interface FinalizeContractPayload {
  pendingContractId: number;
  effectiveDate: string;
}

/**
 * Calls the internal Next.js API route to finalize a pending contract.
 * @param payload - The ID of the pending contract and the confirmed effective date.
 */
export const finalizeContract = async (payload: FinalizeContractPayload): Promise<any> => {
  const apiUrl = '/api/contracts/finalize';
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload), // The payload already has the correct keys
  });

  const responseData = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(responseData.error || 'Failed to finalize contract.');
  }
  return responseData;
};