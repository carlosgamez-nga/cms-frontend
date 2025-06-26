export interface Contract {
  title: string;
  description: string;
  payer_name: string;
  state: string;
  file: File;
  id: number;
  effective_date: string;
  uploaded_at: string;
}

export interface CodeCPT {
  cpt_code: string;
  volume: number;
  contract_rate: number;
  offer_rate: number;
  category_description: string;
  baseline_id: string;
  facility: 'Facility' | 'Non Facility';
  description: string;
  top_codes: string;
  carve_out: string;
  dme: string;
  status_indicator: string;
  modifier: string;
  sheet_name: string;
}

export interface CodeContract {
  cpt_code: string;
  volume: number;
  contract_rate: number;
  offer_rate: number;
  category_description: string;
  baseline_id: string;
  facility: string;
  description: string;
  top_codes: string;
  carve_out: string;
  dme: string;
  status_indicator: string;
  modifier: string;
  sheet_name: string;
}

export interface CPTPrice {
  cpt_code: string;
  price: number;
}

export interface CurrentContractData {
  payer: string;
  facility_type: 'facility' | 'non-facility';
  state: string;
  county: string;
  reimbursement_class: 'MD' | 'Mid-level';
  line_of_business: 'Commercial' | 'Medicare' | string;
  year: string;

  cpt_prices: CPTPrice[];
}

export interface CMSData {
  payer: string;
  facility_type: 'facility' | 'non-facility';
  state: string;
  county: string;
  locality_code: string;
  carrier_code: string;
  year: string;

  cpt_prices: CPTPrice[];
}

export interface PayerPriceCPT {
  cpt_code: string;
  median_price: number;
  percentile_rate_25: number;
  percentile_rate_50: number;
  percentile_rate_75: number;
  percentile_rate_90: number;
  percentile_rate_95: number;
}

export interface PayerPriceData {
  payer: string;
  facility_type: 'facility' | 'non-facility';
  state: string;
  county: string;
  year: string;

  cpt_prices: PayerPriceCPT[];
}

export interface NewContractData {
  payer: string;
  facility_type: 'facility' | 'non-facility';
  state: string;
  county: string;
  reimbursement_class: 'MD' | 'Mid-level';
  line_of_business: 'Commercial' | 'Medicare' | string;
  year: string;

  cpt_prices: CPTPrice[];
}
