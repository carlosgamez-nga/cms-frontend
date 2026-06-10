'use client';

import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
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
import type { ContractRateRow } from './CptRateTable';

interface CptRateChartProps {
  rates: ContractRateRow[];
}

const chartConfig = {
  market_rate: {
    label: 'Market Benchmark',
    color: 'hsl(var(--chart-1))',
  },
  contract_rate: {
    label: 'Contract Rate',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

const CptRateChart = ({ rates }: CptRateChartProps) => {
  return (
    <Card className='bg-primary-foreground'>
      <CardHeader>
        <CardTitle>CPT Rate Benchmark Comparison</CardTitle>
        <CardDescription>Market benchmark vs negotiated contract rate by CPT</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={rates}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey='cpt' tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip content={<ChartTooltipContent indicator='dashed' />} />
            <ChartLegend />
            <Bar dataKey='market_rate' fill='var(--color-market_rate)' radius={4} />
            <Bar dataKey='contract_rate' fill='var(--color-contract_rate)' radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default CptRateChart;
