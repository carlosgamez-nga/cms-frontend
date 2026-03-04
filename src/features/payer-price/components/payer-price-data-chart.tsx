'use client';

import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartTooltip,
} from '@/components/ui/chart';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { PayerPriceChartConfig, PayerPriceChartDatum } from '../types';

interface PayerPriceDataChartProps {
  data: PayerPriceChartDatum[];
  config: PayerPriceChartConfig;
}

const PayerPriceDataChart = ({ data, config }: PayerPriceDataChartProps) => {
  if (!data.length) {
    return (
      <Card className='bg-primary-foreground flex-1'>
        <CardHeader>
          <CardTitle>Market Rate Comparison</CardTitle>
          <CardDescription>No chartable market-rate values were returned.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const chartConfig: ChartConfig = {
    primary_rate: { label: config.primaryLabel, color: '#2662D9' },
    ...(config.secondaryLabel
      ? {
          secondary_rate: { label: config.secondaryLabel, color: '#8EC6FF' },
        }
      : {}),
  };

  return (
    <Card className='bg-primary-foreground flex-1'>
      <CardHeader>
        <CardTitle>Market Rate Comparison</CardTitle>
        <CardDescription>
          Provider API rates grouped by billing code under active filters
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='code'
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 12)}
            />
            <ChartTooltip cursor={false} />
            <ChartLegend />
            <Bar dataKey='primary_rate' fill='#2662D9' radius={4} />
            {config.secondaryLabel ? (
              <Bar dataKey='secondary_rate' fill='#8EC6FF' radius={4} />
            ) : null}
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className='text-sm text-muted-foreground'>
        Showing {data.length} grouped market-rate rows
      </CardFooter>
    </Card>
  );
};

export default PayerPriceDataChart;

