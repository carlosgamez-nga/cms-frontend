/**
 * Submits contract FormData to the internal Next.js API route.
 * This function runs on the client.
 */
export async function postContract(formData: FormData): Promise<any> {
  const apiUrl = '/api/contracts/upload/';

  // 1. Retrieve your auth token. 
  // (Adjust this line based on how you store your token: e.g., document.cookie, localStorage, or a Zustand/Redux store)
  const token = localStorage.getItem('authToken'); 

  const response = await fetch(apiUrl, {
    method: 'POST',
    body: formData,
    headers: {
      // 2. Explicitly send the Token to Django
      'Authorization': `Token ${token}`
    }
  });

  const responseData = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(responseData.error || responseData.detail || 'Contract submission failed.');
  }
  return responseData;
}