import { NewContractData } from '@/lib/types';

export const getNewContractData = async (): Promise<NewContractData> => {
  // testing only
  await new Promise((res) => setTimeout(res, 2000));

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/new_contract_data/`
  );

  return res.json();
};
