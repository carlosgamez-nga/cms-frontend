'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMemo } from 'react';

export interface ContractRateRow {
  cpt: string;
  description: string;
  market_rate: number;
  contract_rate: number;
}

interface CptRateTableProps {
  rates: ContractRateRow[];
}

const variance = (marketRate: number, contractRate: number) => {
  if (!marketRate) return 0;
  return ((contractRate - marketRate) / marketRate) * 100;
};

const getVarianceColorClass = (value: number) => {
  if (value < -5) return 'text-red-500';
  if (value <= 0) return 'text-yellow-500';
  return 'text-green-600';
};

const CptRateTable = ({ rates }: CptRateTableProps) => {
  const sortedRates = useMemo(
    () =>
      [...rates].sort(
        (a, b) =>
          variance(a.market_rate, a.contract_rate) -
          variance(b.market_rate, b.contract_rate)
      ),
    [rates]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>CPT Rate Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='max-h-[400px] overflow-auto'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>CPT Code</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className='text-right'>Market Rate</TableHead>
                <TableHead className='text-right'>Contract Rate</TableHead>
                <TableHead className='text-right'>Impact ($)</TableHead>
                <TableHead className='text-right'>Variance %</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedRates.map((row) => {
                const v = variance(row.market_rate, row.contract_rate);
                const impact = row.market_rate - row.contract_rate;
                return (
                  <TableRow key={row.cpt}>
                    <TableCell>{row.cpt}</TableCell>
                    <TableCell>{row.description}</TableCell>
                    <TableCell className='text-right'>${row.market_rate.toFixed(2)}</TableCell>
                    <TableCell className='text-right'>${row.contract_rate.toFixed(2)}</TableCell>
                    <TableCell className='text-right'>${impact.toFixed(2)}</TableCell>
                    <TableCell className='text-right'>
                      <span className={getVarianceColorClass(v)}>
                        {v >= 0 ? '+' : ''}
                        {v.toFixed(0)}%
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default CptRateTable;
