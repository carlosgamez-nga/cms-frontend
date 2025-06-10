import { CodeContract } from '@/app/dashboard/types';

export const getCptCodes = async (): Promise<CodeContract[]> => {
  // testing only
  await new Promise((res) => setTimeout(res, 2000));

  const res = await fetch(`${process.env.BACKEND_URL}/cpt_codes/`);

  return res.json();
};
