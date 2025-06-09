import { Contract } from '../../../app/dashboard/types';

export const getContracts = async (): Promise<Contract[]> => {
  // testing only
  await new Promise((res) => setTimeout(res, 2000));

  const res = await fetch(`${process.env.BACKEND_URL}/contracts/`);

  return res.json();
};
