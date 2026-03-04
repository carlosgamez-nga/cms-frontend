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

  const columns = Array.from(new Set(rows.flatMap((row) => Object.keys(row))));

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
                {columns.map((column) => (
                  <TableHead key={column}>{column}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {columns.map((column) => (
                    <TableCell key={`${rowIndex}-${column}`}>
                      {String(row[column] ?? '')}
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

