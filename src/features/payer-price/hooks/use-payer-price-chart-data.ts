'use client';

import { useEffect, useMemo, useState } from 'react';
import { getPayerPriceData } from '../queries/get-payer-price-data';
import {
  PayerPriceApiRow,
  PayerPriceChartConfig,
  PayerPriceChartDatum,
  PayerPriceFilterValues,
} from '../types';

const EMPTY_FILTERS: PayerPriceFilterValues = {
  payer: '',
  billing_code: '',
  billing_class: '',
  billing_code_modifiers: '',
  negotiated_type: '',
  provider_taxonomy: '',
};

// Scope note: this flow queries Provider APIs directly from explicit filter input.
// Contract metadata is not inferred or auto-injected to avoid unsupported defaults.

const RATE_CANDIDATES = [
  'negotiated_rate',
  'negotiatedRate',
  'median_price',
  'percentile_rate_50',
  'price',
  'rate',
];

const SECONDARY_RATE_CANDIDATES = [
  'percentile_rate_75',
  'percentile_rate_90',
  'percentile_rate_25',
];

const CODE_CANDIDATES = ['billing_code', 'cpt_code', 'code', 'billingCode'];

const humanizeField = (field: string) =>
  field
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());

const findFirstNumberField = (rows: PayerPriceApiRow[], candidates: string[]) => {
  for (const candidate of candidates) {
    const hasNumericValue = rows.some((row) => typeof row[candidate] === 'number');
    if (hasNumericValue) return candidate;
  }

  // Fallback for unknown response schemas: use first numeric field present.
  const firstNumericEntry = Object.entries(rows[0] ?? {}).find(
    ([, value]) => typeof value === 'number'
  );
  return firstNumericEntry?.[0];
};

const findCodeField = (rows: PayerPriceApiRow[]) => {
  for (const candidate of CODE_CANDIDATES) {
    const hasCodeValue = rows.some((row) => typeof row[candidate] === 'string');
    if (hasCodeValue) return candidate;
  }

  const firstStringEntry = Object.entries(rows[0] ?? {}).find(
    ([, value]) => typeof value === 'string'
  );
  return firstStringEntry?.[0];
};

interface UsePayerPriceChartDataProps {
  initialFilters?: Partial<PayerPriceFilterValues>;
}

export const usePayerPriceChartData = ({
  initialFilters,
}: UsePayerPriceChartDataProps = {}) => {
  const [rows, setRows] = useState<PayerPriceApiRow[]>([]);
  const [filters, setFilters] = useState<PayerPriceFilterValues>({
    ...EMPTY_FILTERS,
    ...initialFilters,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!initialFilters) return;
    setFilters((prev) => ({ ...prev, ...initialFilters }));
  }, [initialFilters]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getPayerPriceData(filters);
        setRows(data);
      } catch (err) {
        setRows([]);
        setError(err instanceof Error ? err.message : 'Failed to load market rates.');
      } finally {
        setIsLoading(false);
      }
    };

    const hasAnyFilter = Object.values(filters).some((value) => value.trim().length);
    if (!hasAnyFilter) {
      setRows([]);
      setError(null);
      return;
    }

    loadData();
  }, [filters]);

  const handleFilterChange = (
    key: keyof PayerPriceFilterValues,
    value: string
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const chartData = useMemo<PayerPriceChartDatum[]>(() => {
    if (!rows.length) return [];

    const codeField = findCodeField(rows);
    const primaryRateField = findFirstNumberField(rows, RATE_CANDIDATES);
    const secondaryRateField = findFirstNumberField(rows, SECONDARY_RATE_CANDIDATES);

    // Limitation: chart rendering depends on at least one numeric field in the response.
    if (!primaryRateField) return [];

    return rows
      .filter(
        (row) =>
          typeof row[primaryRateField] === 'number' &&
          (!codeField || typeof row[codeField] === 'string')
      )
      .map((row, index) => ({
        code: (codeField ? row[codeField] : `Row ${index + 1}`) as string,
        primary_rate: row[primaryRateField] as number,
        secondary_rate:
          secondaryRateField && typeof row[secondaryRateField] === 'number'
            ? (row[secondaryRateField] as number)
            : undefined,
      }));
  }, [rows]);

  const chartConfig = useMemo<PayerPriceChartConfig>(() => {
    if (!rows.length) return { primaryLabel: 'Rate' };

    const primaryRateField = findFirstNumberField(rows, RATE_CANDIDATES) || 'rate';
    const secondaryRateField = findFirstNumberField(rows, SECONDARY_RATE_CANDIDATES);

    return {
      primaryLabel: humanizeField(primaryRateField),
      secondaryLabel: secondaryRateField ? humanizeField(secondaryRateField) : undefined,
    };
  }, [rows]);

  return {
    rows,
    chartData,
    chartConfig,
    filters,
    isLoading,
    error,
    handleFilterChange,
  };
};
