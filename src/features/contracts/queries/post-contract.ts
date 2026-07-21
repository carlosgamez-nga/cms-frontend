// src/features/contracts/queries/post-contract.ts

/**
 * Submits contract FormData to the internal Next.js API route.
 * This function runs on the client.
 */
export async function postContract(formData: FormData): Promise<any> {
  // The URL now points to your internal API route.
  const apiUrl = '/api/contracts/upload/';

  const response = await fetch(apiUrl, {
    method: 'POST',
    body: formData,
    // No auth headers are needed here; the browser sends the cookie.
  });

  const responseData = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(responseData.error || responseData.detail || 'Contract submission failed.');
  }
  return responseData;
}