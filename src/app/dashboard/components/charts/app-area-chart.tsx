'use client';

import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

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
    color: 'hsl(var(--chart-1))',
  },
  last: {
    label: 'Last',
    color: 'hsl(var(--chart-2))',
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

const AppAreaChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Area Chart - Gradient</CardTitle>
        <CardDescription>
          Showing total visitors for the last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='code'
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 5)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <defs>
              <linearGradient id='fillCurrent' x1='0' y1='0' x2='0' y2='1'>
                <stop
                  offset='5%'
                  stopColor='var(--color-current)'
                  stopOpacity={0.8}
                />
                <stop
                  offset='95%'
                  stopColor='var(--color-current)'
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id='fillLast' x1='0' y1='0' x2='0' y2='1'>
                <stop
                  offset='5%'
                  stopColor='var(--color-last)'
                  stopOpacity={0.8}
                />
                <stop
                  offset='95%'
                  stopColor='var(--color-last)'
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey='last'
              type='natural'
              fill='url(#fillLast)'
              fillOpacity={0.4}
              stroke='var(--color-last)'
              stackId='a'
            />
            <Area
              dataKey='current'
              type='natural'
              fill='url(#fillCurrent)'
              fillOpacity={0.4}
              stroke='var(--color-current)'
              stackId='a'
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className='flex w-full items-start gap-2 text-sm'>
          <div className='grid gap-2'>
            <div className='flex items-center gap-2 font-medium leading-none'>
              Trending up by 5.2% this month <PiTrendUp className='h-4 w-4' />
            </div>
            <div className='flex items-center gap-2 leading-none text-muted-foreground'>
              January - June 2024
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default AppAreaChart;
