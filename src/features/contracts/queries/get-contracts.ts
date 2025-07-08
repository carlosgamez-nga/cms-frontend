import { Contract } from '@/lib/types';

export const getContracts = async (): Promise<Contract[]> => {
  try {
    // Simulate delay (for testing)
    await new Promise((res) => setTimeout(res, 2000));

    const res = await fetch(`${process.env.BACKEND_URL}/contracts/`);

    if (!res.ok) {
      throw new Error(
        `Failed to fetch contracts: ${res.status} ${res.statusText}`
      );
    }

    return res.json();
  } catch (error) {
    console.error('Error in getContracts:', error);
    throw error;
  }
};
