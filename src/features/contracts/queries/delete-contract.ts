'use server';

import { getAuthenticatedHeaders } from '@/lib/auth';

export const deleteContract = async (
  id: string | number
): Promise<{ success: boolean; error?: string }> => {
  const headers = await getAuthenticatedHeaders();
  if (!headers['Authorization']) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/contracts/${id}/`, {
      method: 'DELETE',
      headers,
    });

    if (res.ok) {
      return { success: true };
    } else {
      return { success: false, error: `Failed with status ${res.status}` };
    }
  } catch (err) {
    console.error('Error deleting contract:', err);
    return { success: false, error: 'Network error' };
  }
};
