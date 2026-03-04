import { CMSData } from '@/lib/types';
import { ContractAnalysisFilterValues } from '@/features/contract-analysis/types';

export const getCMSData = async (
  filters?: Partial<ContractAnalysisFilterValues>
): Promise<CMSData> => {
  // testing only
  await new Promise((res) => setTimeout(res, 2000));

  const queryParams = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        queryParams.append(key, value);
      }
    });
  }

  const queryString = queryParams.toString();
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/cms_data/${queryString ? `?${queryString}` : ''
    }`;

  /* MOCK DATA FOR VERIFICATION */
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
  } catch (error) {
    console.warn('Using mock CMS data for verification');
    return {
      payer: 'Mock Payer',
      facility_type: 'facility',
      state: 'TX',
      county: 'Harris',
      locality_code: '01',
      carrier_code: '12345',
      year: '2024',
      cpt_prices: [
        { cpt_code: '99213', price: 100 },
        { cpt_code: '99214', price: 150 },
        { cpt_code: '99203', price: 120 },
        { cpt_code: '99204', price: 180 },
        { cpt_code: '10001', price: 50 },
      ],
    };
  }
};
