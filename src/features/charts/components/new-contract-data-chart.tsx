'use client';

import { useState, useEffect } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  XAxis,
  TooltipProps,
} from 'recharts';
import type {
  ValueType,
  NameType,
} from 'recharts/types/component/DefaultTooltipContent';
import { PiTrendUp } from 'react-icons/pi';

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

import { getCurrentContractData } from '../queries/get-current-contract-data';
import { getNewContractData } from '../queries/get-new-contract-data';

type ChartDatum = {
  code: string;
  current_contract: number;
  new_contract: number;
  newContractFill: string;
};

const LegendItem = ({ color, label }: { color: string; label: string }) => (
  <div className='flex items-center gap-2'>
    <span
      className='inline-block h-3 w-3 rounded-full'
      style={{ backgroundColor: color }}
    />
    <span>{label}</span>
  </div>
);

const ChartLegendContent = () => (
  <div className='flex gap-1 mt-4 flex-wrap text-sm items-center justify-center lg:gap-4'>
    <LegendItem color='#2662D9' label='Current Contract' />
    <LegendItem color='#8EC6FF' label='Equal to Current' />
    <LegendItem color='#16a34a' label='↑ Above Current' />
    <LegendItem color='#dc2626' label='↓ Below Current' />
  </div>
);

const ChartTooltipContent = ({
  payload = [],
}: TooltipProps<ValueType, NameType>) => {
  if (!payload.length) return null;

  const data = payload[0].payload;

  return (
    <div className='rounded-md border bg-background p-3 shadow-sm'>
      <div className='font-medium text-sm mb-1'>Code: {data.code}</div>
      <ul className='space-y-1 text-sm'>
        <li className='flex items-center justify-between'>
          <span className='text-muted-foreground'>Current:</span>
          <span className='text-[#2662D9]'>{data.current_contract}</span>
        </li>
        <li className='flex items-center justify-between'>
          <span className='text-muted-foreground'>New:</span>
          <span style={{ color: data.newContractFill }}>
            {data.new_contract}
          </span>
        </li>
      </ul>
    </div>
  );
};

const NewContractDataChart = () => {
  const [chartData, setChartData] = useState<ChartDatum[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const current = await getCurrentContractData();
      const next = await getNewContractData();

      const currentMap = Object.fromEntries(
        current.cpt_prices.map(({ cpt_code, price }) => [cpt_code, price])
      );

      const newMap = Object.fromEntries(
        next.cpt_prices.map(({ cpt_code, price }) => [cpt_code, price])
      );

      const merged = Object.keys(currentMap).map((code) => {
        const currentPrice = currentMap[code];
        const newPrice = newMap[code];

        return {
          code,
          current_contract: currentPrice,
          new_contract: newPrice,
          newContractFill:
            newPrice > currentPrice
              ? '#16a34a'
              : newPrice < currentPrice
              ? '#dc2626'
              : '#8EC6FF',
        };
      });

      setChartData(merged);
    };

    loadData();
  }, []);

  const chartConfig: ChartConfig = {
    current_contract: { label: 'Current Contract', color: '#2662D9' },
    new_contract: { label: 'New Contract', color: '#8EC6FF' },
  };

  return (
    <Card className='bg-primary-foreground'>
      <CardHeader>
        <CardTitle>New Contract vs Current Contract</CardTitle>
        <CardDescription>Rate comparison by CPT code</CardDescription>
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
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey='current_contract' fill='#2662D9' radius={4} />
            <Bar dataKey='new_contract' radius={4}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.newContractFill} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className='flex-col items-start gap-2 text-sm'>
        <div className='flex gap-2 font-medium leading-none'>
          New vs Current contract rates <PiTrendUp className='h-4 w-4' />
        </div>
        <div className='leading-none text-muted-foreground'>
          Showing {chartData.length} CPT codes per comparison
        </div>
      </CardFooter>
    </Card>
  );
};

export default NewContractDataChart;
