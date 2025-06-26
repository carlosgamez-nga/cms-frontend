import { Contract } from '@/lib/types';
import { getContracts } from './get-contracts';

export const getContract = async (
  contractId: string
): Promise<Contract | null> => {
  const contracts = await getContracts();

  const contract = contracts.find(
    (contract) => contract.id === parseInt(contractId)
  );

  return new Promise((res) => res(contract || null));
};
