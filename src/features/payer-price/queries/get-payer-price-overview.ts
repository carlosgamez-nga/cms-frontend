export interface PayerPriceOverviewRow {
  contract_id: number;
  contract_title: string;
  payer_name: string;
  avg_market_rate: number;
  avg_contract_rate: number;
  matched_codes: number;
  variance_pct: number;
}

export const getPayerPriceOverview = async (): Promise<PayerPriceOverviewRow[]> => {
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
  const res = await fetch(`${apiBase}/payer_price_overview`);

  if (!res.ok) {
    throw new Error(`Failed to fetch payer-price overview (${res.status})`);
  }

  return res.json();
};

