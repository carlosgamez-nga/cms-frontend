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

import { getPayerPriceData } from '../queries/get-payer-price-data';
import { getCurrentContractData } from '../queries/get-current-contract-data';

type ChartDatum = {
  code: string;
  current_contract: number;
  payer_price: number;
  currentContractFill: string;
};

const ChartLegendContent = () => (
  <div className='flex gap-1 mt-4 flex-wrap text-sm items-center justify-center lg:gap-4'>
    <LegendItem color='#2662D9' label='Payer Price' />
    <LegendItem color='#8EC6FF' label='Equal to Payer' />
    <LegendItem color='#16a34a' label='↑ Above Payer' />
    <LegendItem color='#dc2626' label='↓ Below Payer' />
  </div>
);

const LegendItem = ({ color, label }: { color: string; label: string }) => (
  <div className='flex items-center gap-2'>
    <span
      className='inline-block h-3 w-3 rounded-full'
      style={{ backgroundColor: color }}
    />
    <span>{label}</span>
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
          <span className='text-muted-foreground'>Payer Price:</span>
          <span className='text-[#2662D9]'>{data.payer_price}</span>
        </li>
        <li className='flex items-center justify-between'>
          <span className='text-muted-foreground'>Current:</span>
          <span style={{ color: data.currentContractFill }}>
            {data.current_contract}
          </span>
        </li>
      </ul>
    </div>
  );
};

const PayerPriceDataChart = () => {
  const [chartData, setChartData] = useState<ChartDatum[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const current = await getCurrentContractData();
      const payer = await getPayerPriceData();

      const currentMap = Object.fromEntries(
        current.cpt_prices.map(({ cpt_code, price }) => [cpt_code, price])
      );

      const payerMap = Object.fromEntries(
        payer.cpt_prices.map(({ cpt_code, median_price }) => [
          cpt_code,
          median_price,
        ])
      );

      const merged = Object.keys(currentMap).map((code) => {
        const currentPrice = currentMap[code];
        const payerPrice = payerMap[code];

        return {
          code,
          current_contract: currentPrice,
          payer_price: payerPrice,
          currentContractFill:
            currentPrice > payerPrice
              ? '#16a34a'
              : currentPrice < payerPrice
              ? '#dc2626'
              : '#8EC6FF',
        };
      });

      setChartData(merged);
    };

    loadData();
  }, []);

  const chartConfig: ChartConfig = {
    current_contract: { label: 'Current Contract', color: '#8EC6FF' },
    payer_price: { label: 'Payer Price', color: '#2662D9' },
  };

  return (
    <Card className='bg-primary-foreground'>
      <CardHeader>
        <CardTitle>Payer Price vs Current Contract</CardTitle>
        <CardDescription>Comparison by CPT code</CardDescription>
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
            <Bar dataKey='payer_price' fill='#2662D9' radius={4} />
            <Bar dataKey='current_contract' radius={4}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.currentContractFill} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className='flex-col items-start gap-2 text-sm'>
        <div className='flex gap-2 font-medium leading-none'>
          Price comparison with payer Price <PiTrendUp className='h-4 w-4' />
        </div>
        <div className='leading-none text-muted-foreground'>
          Showing {chartData.length} CPT codes per comparison
        </div>
      </CardFooter>
    </Card>
  );
};

export default PayerPriceDataChart;
