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

type ComparisonRow = {
  cpt: string;
  market_benchmark: number;
  contract_rate: number;
};

interface MarketComparisonChartProps {
  rows: ComparisonRow[];
}

const chartConfig = {
  market_benchmark: {
    label: 'Market Benchmark',
    color: 'hsl(var(--chart-1))',
  },
  contract_rate: {
    label: 'Contract Rate',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

const MarketComparisonChart = ({ rows }: MarketComparisonChartProps) => {
  return (
    <Card className='bg-primary-foreground'>
      <CardHeader>
        <CardTitle>Market vs Contract Comparison</CardTitle>
        <CardDescription>Comparison grouped by CPT code</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={rows}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey='cpt' tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip content={<ChartTooltipContent indicator='dashed' />} />
            <ChartLegend />
            <Bar dataKey='market_benchmark' fill='var(--color-market_benchmark)' radius={4} />
            <Bar dataKey='contract_rate' fill='var(--color-contract_rate)' radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default MarketComparisonChart;
