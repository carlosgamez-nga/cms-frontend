'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import { PiTrendDown } from 'react-icons/pi';

import { CodeCPT } from '@/features/types';

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
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

type CodesProps = {
  codes: CodeCPT[];
};

const chartConfig = {
  current_percentage: {
    label: 'Current',
    color: 'hsl(var(--chart-1))',
  },
  offer_percentage: {
    label: 'Offer',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

const CodeBarChart = ({ codes }: CodesProps) => {
  return (
    <Card className='bg-primary-foreground'>
      <CardHeader>
        <CardTitle>Rate Comparison</CardTitle>
        <CardDescription>CPT codes</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={codes}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='code'
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 5)}
            />
            <YAxis />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator='dashed' />}
            />
            <Bar
              dataKey='offer_percentage'
              fill='var(--color-offer_percentage)'
              radius={4}
            />
            <Bar
              dataKey='current_percentage'
              fill='var(--color-current_percentage)'
              radius={4}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className='flex-col items-start gap-2 text-sm'>
        <div className='flex gap-2 font-medium leading-none'>
          Trending down this month <PiTrendDown className='h-4 w-4' />
        </div>
        <div className='leading-none text-muted-foreground'>
          Showing 5 CPT Codes per contract
        </div>
      </CardFooter>
    </Card>
  );
};

export default CodeBarChart;
