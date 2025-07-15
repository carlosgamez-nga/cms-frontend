import axios from 'axios';

type ValuesProps = {
  title: string;
  description: string;
  payer_name: string;
  state: string;
  file: File;
};

export const postContract = async (values: ValuesProps) => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  // --- ADD THIS LINE ---
  console.log('API_BASE_URL from environment:', API_BASE_URL);
  // --- END ADDITION ---


  const formData = new FormData();
  formData.append('title', values.title);
  formData.append('description', values.description);
  formData.append('payer_name', values.payer_name);
  formData.append('state', values.state);
  formData.append('file', values.file);

  // --- ADD THIS LINE to check FormData contents (optional, but helpful) ---
  console.log('FormData contents:');
  for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
  }
  // --- END ADDITION ---


  const authToken = localStorage.getItem('authToken');

  if (!authToken) {
    throw new Error('Authentication token not found. Please log in.');
  }

  try {
    const res = await fetch(`${API_BASE_URL}/api/contracts/upload/`, {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Token ${authToken}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error('API Error Response:', errorData);
      throw new Error(errorData.detail || errorData.message || 'Failed to upload contract. Please check server logs.');
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error during contract upload:', error);
    throw error;
  }
};