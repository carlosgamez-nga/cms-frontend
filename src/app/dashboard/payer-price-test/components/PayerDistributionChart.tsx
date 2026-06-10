'use client';

import { useMemo } from 'react';
import { Cell, Pie, PieChart } from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { OverviewContract } from './contracts-table-columns';

interface PayerDistributionChartProps {
  contracts: OverviewContract[];
}

const chartConfig = {
  contract_revenue: {
    label: 'Contract Revenue',
    color: 'hsl(var(--chart-3))',
  },
} satisfies ChartConfig;

const PAYER_COLORS: Record<string, string> = {
  UHC: 'hsl(var(--chart-1))',
  Aetna: 'hsl(var(--chart-2))',
  Cigna: 'hsl(var(--chart-3))',
  'Blue Shield': 'hsl(var(--chart-4))',
  Unknown: 'hsl(var(--chart-5))',
};

const PayerDistributionChart = ({ contracts }: PayerDistributionChartProps) => {
  const data = useMemo(() => {
    const totals = contracts.reduce<Record<string, number>>((acc, contract) => {
      const payer = contract.payer_name || 'Unknown';
      acc[payer] = (acc[payer] || 0) + (contract.contract_rate || 0);
      return acc;
    }, {});

    return Object.entries(totals).map(([payer, revenue]) => ({
      payer,
      contract_revenue: Number(revenue.toFixed(2)),
    }));
  }, [contracts]);

  return (
    <Card className='bg-primary-foreground'>
      <CardHeader>
        <CardTitle>Payer Distribution</CardTitle>
        <CardDescription>Contract revenue by payer</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={data}
              dataKey='contract_revenue'
              nameKey='payer'
              innerRadius={55}
              outerRadius={90}
              paddingAngle={2}
            >
              {data.map((entry) => (
                <Cell key={entry.payer} fill={PAYER_COLORS[entry.payer] || PAYER_COLORS.Unknown} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
        <div className='mt-4 grid grid-cols-2 gap-2 text-sm'>
          {data.map((entry) => (
            <div key={`legend-${entry.payer}`} className='flex items-center gap-2'>
              <span
                className='inline-block h-3 w-3 rounded-full'
                style={{
                  backgroundColor: PAYER_COLORS[entry.payer] || PAYER_COLORS.Unknown,
                }}
              />
              <span className='text-muted-foreground'>
                {entry.payer} (${entry.contract_revenue.toFixed(2)})
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PayerDistributionChart;
