'use client';

import { TrendingUp } from 'lucide-react';
import { Pie, PieChart } from 'recharts';
import { CodeCPT } from '@/features/types';

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
  const chartData = codes.map((code, index) => ({
    name: code.code, // CPT code as label
    value: code.current_percentage, // Current rate for visualization
    fill: `hsl(var(--chart-${index + 1}))`, // Dynamic color per code
  }));

  const chartConfig: ChartConfig = codes.reduce((config, code, index) => {
    config[code.code] = {
      label: `${code.code}:`,
      color: `hsl(var(--chart-${index + 1}))`,
    };
    return config;
  }, {} as ChartConfig);

  return (
    <Card className='flex flex-col'>
      <CardHeader className='items-center pb-0'>
        <CardTitle>Current Rate Distribution</CardTitle>
        <CardDescription>Based on CPT codes</CardDescription>
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
              dataKey='value' // Using current_rate for data visualization
              nameKey='name' // Using CPT code as the label
              labelLine={false}
              // label={({ payload, ...props }) => (
              //   <text
              //     cx={props.cx}
              //     cy={props.cy}
              //     x={props.x}
              //     y={props.y}
              //     textAnchor={props.textAnchor}
              //     dominantBaseline={props.dominantBaseline}
              //     fill='hsla(var(--foreground))'
              //   >
              //     {payload.value} {/* Displays current rate */}
              //   </text>
              // )}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className='flex-col gap-2 text-sm'>
        <div className='flex items-center gap-2 font-medium leading-none'>
          Trending up by 5.2% this month <TrendingUp className='h-4 w-4' />
        </div>
        <div className='leading-none text-muted-foreground'>
          Showing CPT codes current rate distribution
        </div>
      </CardFooter>
    </Card>
  );
};

export default CodePieChart;
