import { CodeCPT } from '@/lib/types';

export const getCptCodes = async (): Promise<CodeCPT[]> => {
  // testing only
  await new Promise((res) => setTimeout(res, 2000));

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
  const res = await fetch(`${API_BASE_URL}/cpt_codes`);

  return res.json();
};
