export async function postContract(formData: FormData): Promise<any> {
  const apiUrl = '/api/contracts/upload/';

  // 1. Helper function to read a specific cookie by name
  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
    return null;
  };

  // 2. Grab the token from the 'authToken' cookie
  const token = getCookie('authToken');

  const response = await fetch(apiUrl, {
    method: 'POST',
    body: formData,
    headers: {
      // 3. Send the token to Django
      'Authorization': `Token ${token}`
    }
  });

  const responseData = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(responseData.error || responseData.detail || 'Contract submission failed.');
  }
  return responseData;
}