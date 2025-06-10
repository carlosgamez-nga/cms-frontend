'use client';

import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import { PiTrendUp } from 'react-icons/pi';

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

const chartConfig = {
  current: {
    label: 'Current',
    color: 'var(--chart-1)',
  },
  last: {
    label: 'Last',
    color: 'var(--chart-2)',
  },
} satisfies ChartConfig;

const chartData = [
  {
    code: '36475',
    current: 186,
    last: 80,
  },
  {
    code: '36478',
    current: 305,
    last: 200,
  },
  {
    code: '36482',
    current: 237,
    last: 120,
  },
  {
    code: '37253',
    current: 73,
    last: 190,
  },
  {
    code: '76942',
    current: 120,
    last: 100,
  },
  {
    code: '93970',
    current: 245,
    last: 140,
  },
  {
    code: '93971',
    current: 189,
    last: 100,
  },
  {
    code: '93976',
    current: 133,
    last: 90,
  },
  {
    code: '99212',
    current: 125,
    last: 100,
  },
  {
    code: '99213',
    current: 214,
    last: 140,
  },
];

const AppBarChart = () => {
  return (
    <Card className='bg-primary-foreground'>
      <CardHeader>
        <CardTitle>Contract Revenue</CardTitle>
        <CardDescription>CPT codes</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='code'
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 5)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator='dashed' />}
            />
            <Bar dataKey='last' fill='var(--color-last)' radius={4} />
            <Bar dataKey='current' fill='var(--color-current)' radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className='flex-col items-start gap-2 text-sm'>
        <div className='flex gap-2 font-medium leading-none'>
          Trending up this month <PiTrendUp className='h-4 w-4' />
        </div>
        <div className='leading-none text-muted-foreground'>
          Showing 10 CPT codes per contract
        </div>
      </CardFooter>
    </Card>
  );
};

export default AppBarChart;
