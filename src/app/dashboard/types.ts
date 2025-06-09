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
  code: string;
  current_rate: number;
  current_percentage: number;
  offer_rate: number;
  offer_percentage: number;
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
