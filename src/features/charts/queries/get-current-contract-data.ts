import { CurrentContractData } from '@/lib/types';

export const getCurrentContractData =
  async (): Promise<CurrentContractData> => {
    // testing only
    await new Promise((res) => setTimeout(res, 2000));

    /* MOCK DATA FOR VERIFICATION */
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/current_contract_data/`
      );
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    } catch (error) {
      console.warn('Using mock Current Contract data for verification');
      return {
        payer: 'Mock Payer',
        facility_type: 'facility',
        state: 'TX',
        county: 'Harris',
        reimbursement_class: 'MD',
        line_of_business: 'Commercial',
        year: '2024',
        cpt_prices: [
          { cpt_code: '99213', price: 110 },
          { cpt_code: '99214', price: 140 },
          { cpt_code: '99203', price: 120 },
          { cpt_code: '99204', price: 190 },
          { cpt_code: '10002', price: 60 },
        ],
      };
    }
  };
