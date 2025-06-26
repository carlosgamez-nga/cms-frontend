import { CurrentContractData } from '@/lib/types';

export const getCurrentContractData =
  async (): Promise<CurrentContractData> => {
    // testing only
    await new Promise((res) => setTimeout(res, 2000));

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/current_contract_data/`
    );

    return res.json();
  };
