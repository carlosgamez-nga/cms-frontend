import { CodeContract } from '@/features/types';
import { cptCodes } from '../../../../cpt-codes';

export const getCodes = async (): Promise<CodeContract[]> => {
  await new Promise((res) => setTimeout(res, 2000));

  return new Promise((res) => {
    res(cptCodes);
  });
};
