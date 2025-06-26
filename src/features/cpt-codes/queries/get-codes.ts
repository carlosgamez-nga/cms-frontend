import { CodeCPT } from '@/lib/types';

export const getCptCodes = async (): Promise<CodeCPT[]> => {
  // testing only
  await new Promise((res) => setTimeout(res, 2000));

  const res = await fetch(`${process.env.BACKEND_URL}/cpt_codes/`);

  return res.json();
};
