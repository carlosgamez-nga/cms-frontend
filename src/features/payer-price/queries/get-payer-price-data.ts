import { PayerPriceApiRow, PayerPriceFilterValues } from '../types';

const BILLING_TOKEN_REGEX = /^[A-Za-z0-9.-]+$/;
const TAXONOMY_REGEX = /^[A-Za-z0-9]+$/;

const splitCsv = (value: string) =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

const assertValidFilters = (filters: PayerPriceFilterValues) => {
  const hasAnyFilter = Object.values(filters).some((value) => value.trim().length);
  if (!hasAnyFilter) {
    throw new Error('At least one filter is required before querying market rates.');
  }

  if (
    filters.billing_code &&
    !splitCsv(filters.billing_code).every((code) => BILLING_TOKEN_REGEX.test(code))
  ) {
    throw new Error('Billing code includes invalid characters.');
  }

  if (
    filters.billing_code_modifiers &&
    !splitCsv(filters.billing_code_modifiers).every((mod) =>
      BILLING_TOKEN_REGEX.test(mod)
    )
  ) {
    throw new Error('Billing code modifiers include invalid characters.');
  }

  if (
    filters.provider_taxonomy &&
    !splitCsv(filters.provider_taxonomy).every((taxonomy) =>
      TAXONOMY_REGEX.test(taxonomy)
    )
  ) {
    throw new Error('Provider taxonomy includes invalid characters.');
  }
};

const extractRows = (payload: unknown): PayerPriceApiRow[] => {
  if (Array.isArray(payload)) {
    return payload.filter((row): row is PayerPriceApiRow => !!row && typeof row === 'object');
  }

  if (!payload || typeof payload !== 'object') {
    return [];
  }

  const record = payload as Record<string, unknown>;
  // Assumption: Provider API list responses are nested under one of these common keys.
  // Limitation: if the API introduces a new container key, this list must be updated.
  const collectionCandidates = ['results', 'data', 'rates', 'items', 'cpt_prices'];

  for (const key of collectionCandidates) {
    const value = record[key];
    if (Array.isArray(value)) {
      return value.filter(
        (row): row is PayerPriceApiRow => !!row && typeof row === 'object'
      );
    }
  }

  return [];
};

export const getPayerPriceData = async (
  filters: PayerPriceFilterValues
): Promise<PayerPriceApiRow[]> => {
  assertValidFilters(filters);

  const providerEndpoint = process.env.NEXT_PUBLIC_PAYER_PRICE_API_URL;
  const mockApiBase = process.env.NEXT_PUBLIC_API_BASE_URL;

  const payload: Record<string, unknown> = {};

  // Keep filter-to-parameter mapping explicit and 1:1 with Provider API concepts.
  // Assumption: this endpoint accepts top-level arrays for these parameters.
  // Limitation: if the provider expects nested structures, update this mapping only here.
  if (filters.payer) payload.payers = splitCsv(filters.payer);
  if (filters.billing_code) payload.billingCodeAndTypes = splitCsv(filters.billing_code);
  if (filters.billing_class) payload.billingClasses = splitCsv(filters.billing_class);
  if (filters.billing_code_modifiers) {
    payload.billingCodeModifiers = splitCsv(filters.billing_code_modifiers);
  }
  if (filters.negotiated_type) payload.negotiatedTypes = [filters.negotiated_type];
  if (filters.provider_taxonomy) payload.taxonomyCodes = splitCsv(filters.provider_taxonomy);

  const response = providerEndpoint
    ? await fetch(providerEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
    : await fetch(`${mockApiBase || 'http://localhost:4000'}/payer_price_data`);

  if (!response.ok) {
    throw new Error(`Provider API request failed (${response.status}).`);
  }

  const json = (await response.json()) as unknown;
  return extractRows(json);
};
