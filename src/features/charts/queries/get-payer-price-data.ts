import { PayerPriceData } from '@/lib/types';

export const getPayerPriceData = async (): Promise<PayerPriceData> => {
  // testing only
  await new Promise((res) => setTimeout(res, 2000));

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/payer_price_data/`
  );

  return res.json();
};
