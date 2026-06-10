'use client';

import { useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
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

interface ContractsByStatusChartProps {
  contracts: OverviewContract[];
}

const chartConfig = {
  contracts: {
    label: 'Contracts',
    color: 'hsl(var(--chart-4))',
  },
} satisfies ChartConfig;

const ORDER: Array<OverviewContract['status']> = [
  'Active',
  'Draft',
  'Pending Renewal',
];

const ContractsByStatusChart = ({ contracts }: ContractsByStatusChartProps) => {
  const data = useMemo(() => {
    const counts = contracts.reduce<Record<string, number>>((acc, contract) => {
      const status = contract.status || 'Draft';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    return ORDER.map((status) => ({
      status,
      contracts: counts[status] || 0,
    }));
  }, [contracts]);

  return (
    <Card className='bg-primary-foreground'>
      <CardHeader>
        <CardTitle>Contracts by Status</CardTitle>
        <CardDescription>Distribution of contract lifecycle stages</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey='status' tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis allowDecimals={false} />
            <ChartTooltip content={<ChartTooltipContent indicator='dashed' />} />
            <ChartLegend />
            <Bar dataKey='contracts' fill='var(--color-contracts)' radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default ContractsByStatusChart;
