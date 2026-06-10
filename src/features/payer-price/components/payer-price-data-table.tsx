'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PayerPriceApiRow } from '../types';

interface PayerPriceDataTableProps {
  rows: PayerPriceApiRow[];
}

const marketRateColumns = [
  { label: 'CPT Code', keys: ['cpt_code', 'cpt', 'billing_code'] },
  { label: 'Median Price', keys: ['median_price'] },
  { label: '25th Percentile', keys: ['percentile_rate_25', 'percentile_25'] },
  { label: '50th Percentile', keys: ['percentile_rate_50', 'percentile_50'] },
] as const;

const getValueByKeys = (
  row: PayerPriceApiRow,
  keys: readonly string[]
): string | number | boolean | null | undefined => {
  for (const key of keys) {
    if (key in row) return row[key];
  }
  return '';
};

const PayerPriceDataTable = ({ rows }: PayerPriceDataTableProps) => {
  if (!rows.length) {
    return (
      <Card className='w-full'>
        <CardHeader>
          <CardTitle>Market Rate Results</CardTitle>
        </CardHeader>
        <CardContent className='text-sm text-muted-foreground'>
          No market-rate rows found for the active filters.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>Market Rate Results</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='max-h-[450px] overflow-auto'>
          <Table>
            <TableHeader>
              <TableRow>
                {marketRateColumns.map((column) => (
                  <TableHead key={column.label}>{column.label}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {marketRateColumns.map((column) => (
                    <TableCell key={`${rowIndex}-${column.label}`}>
                      {String(getValueByKeys(row, column.keys) ?? '')}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default PayerPriceDataTable;
