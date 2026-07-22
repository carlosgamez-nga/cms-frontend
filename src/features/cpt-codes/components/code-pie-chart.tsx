'use client';

import { TrendingUp } from 'lucide-react';
import { Pie, PieChart } from 'recharts';
import { CodeCPT } from '@/lib/types';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

type CodesProps = {
  codes: CodeCPT[];
};

const CodePieChart = ({ codes }: CodesProps) => {
  // 1. Calculate the financial value (volume * rate) for the pie slice
  const chartData = codes.map((code, index) => ({
    name: code.cpt_code, 
    value: code.volume * code.contract_rate, 
    fill: `hsl(var(--chart-${index + 1}))`, 
  }));

  // 2. Map config keys using cpt_code instead of code.code
  const chartConfig: ChartConfig = codes.reduce((config, code, index) => {
    config[code.cpt_code] = {
      label: `${code.cpt_code}:`,
      color: `hsl(var(--chart-${index + 1}))`,
    };
    return config;
  }, {} as ChartConfig);

  return (
    <Card className='flex flex-col'>
      <CardHeader className='items-center pb-0'>
        <CardTitle>Financial Value Distribution</CardTitle>
        <CardDescription>Volume × Contract Rate</CardDescription>
      </CardHeader>
      <CardContent className='flex-1 pb-0'>
        <ChartContainer
          config={chartConfig}
          className='mx-auto aspect-square max-h-[300px] px-0'
        >
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey='name' hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey='value'
              nameKey='name'
              labelLine={false}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className='flex-col gap-2 text-sm'>
        <div className='flex items-center gap-2 font-medium leading-none'>
          Trending up by 5.2% this month <TrendingUp className='h-4 w-4' />
        </div>
        <div className='leading-none text-muted-foreground'>
          Showing CPT codes by total contract value
        </div>
      </CardFooter>
    </Card>
  );
};

export default CodePieChart;