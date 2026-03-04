export type PayerPriceFilterValues = {
  payer: string;
  billing_code: string;
  billing_class: string;
  billing_code_modifiers: string;
  negotiated_type: string;
  provider_taxonomy: string;
};

export type PayerPriceApiRow = Record<
  string,
  string | number | boolean | null | undefined
>;

export type PayerPriceChartDatum = {
  code: string;
  primary_rate: number;
  secondary_rate?: number;
};

export type PayerPriceChartConfig = {
  primaryLabel: string;
  secondaryLabel?: string;
};

