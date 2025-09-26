'use client';

import { useState, useEffect } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, XAxis, TooltipProps } from 'recharts';
import type { ValueType, NameType } from 'recharts/types/component/DefaultTooltipContent';
import { PiTrendUp } from 'react-icons/pi';

import { ChartConfig, ChartContainer, ChartLegend, ChartTooltip } from '@/components/ui/chart';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Contract } from '@/lib/types';

// --- Chart-specific components (Legend, Tooltip) ---
const ChartLegendContent = () => ( <div className='flex gap-1 mt-4 flex-wrap text-sm items-center justify-center lg:gap-4'> <LegendItem color='#2662D9' label='Payer Price (50th %)' /> <LegendItem color='#8EC6FF' label='Equal to Payer' /> <LegendItem color='#16a34a' label='↑ Above Payer' /> <LegendItem color='#dc2626' label='↓ Below Payer' /> </div> );
const LegendItem = ({ color, label }: { color: string; label: string }) => ( <div className='flex items-center gap-2'> <span className='inline-block h-3 w-3 rounded-full' style={{ backgroundColor: color }} /> <span>{label}</span> </div> );
const ChartTooltipContent = ({ payload = [] }: TooltipProps<ValueType, NameType>) => { if (!payload || payload.length === 0) return null; const data = payload[0].payload; return ( <div className='rounded-md border bg-background p-3 shadow-sm'> <div className='font-medium text-sm mb-1'>Code: {data.code}</div> <ul className='space-y-1 text-sm'> <li className='flex items-center justify-between'> <span className='text-muted-foreground'>Payer Price (50th):</span> <span className='font-bold text-[#2662D9]'>${data.payer_price.toFixed(2)}</span> </li> <li className='flex items-center justify-between'> <span className='text-muted-foreground'>Current:</span> <span className='font-bold' style={{ color: data.currentContractFill }}>${data.current_contract.toFixed(2)}</span> </li> </ul> </div> ); };
// ---

type ChartDatum = {
  code: string;
  current_contract: number;
  payer_price: number;
  currentContractFill: string;
};

interface PayerPriceDataChartProps {
  contractData: Contract;
  payerPriceData: any;
  submittedCodes: string[];
  analysisData: any[] | null; // <-- The new prop
}

const PayerPriceDataChart = ({ contractData, payerPriceData, submittedCodes, analysisData }: PayerPriceDataChartProps) => {
  const [chartData, setChartData] = useState<ChartDatum[]>([]);

  useEffect(() => {
    if (payerPriceData && submittedCodes && analysisData) {
      const percentileRows = payerPriceData?.message?.[0]?.percentileRows || [];
      const payerMap = new Map<string, number>( percentileRows.map((item: any) => [ item.billing_code, item.percentile_50 ]) );
      
      // Use the "contract_rate" from the new analysisData prop
      const contractRateMap = new Map<string, number>(
        analysisData.map(item => [item.cpt_code, parseFloat(item.contract_rate)])
      );
      
      const merged = submittedCodes.map((code) => {
        const payerPrice = payerMap.get(code) || 0;
        const currentPrice = contractRateMap.get(code) || 0; // <-- Use the new map
        return {
          code,
          current_contract: currentPrice,
          payer_price: payerPrice,
          currentContractFill: currentPrice > payerPrice ? '#16a3a' : currentPrice < payerPrice ? '#dc2626' : '#8EC6FF',
        };
      });
      setChartData(merged);
    }
  }, [contractData, payerPriceData, submittedCodes, analysisData]);

  const chartConfig: ChartConfig = {
    current_contract: { label: 'Current Contract', color: '#8EC6FF' },
    payer_price: { label: 'Payer Price', color: '#2662D9' },
  };

  if (chartData.length === 0) {
    return ( <Card className='bg-primary-foreground flex items-center justify-center h-full min-h-[300px]'><CardHeader><CardTitle>Payer Price vs Current Contract</CardTitle><CardContent className='pt-4'><p className='text-muted-foreground'>No data to display.</p></CardContent></CardHeader></Card> );
  }

  return (
    <Card className='bg-primary-foreground'>
      <CardHeader><CardTitle>Payer Price vs Current Contract</CardTitle><CardDescription>Comparison by CPT code</CardDescription></CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="code" tickLine={false} tickMargin={10} axisLine={false} tickFormatter={(value) => String(value).slice(0, 5)} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="payer_price" fill="#2662D9" radius={4} />
            <Bar dataKey="current_contract" radius={4}>
              {chartData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.currentContractFill} />))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className='flex-col items-start gap-2 text-sm'>
        <div className='flex gap-2 font-medium leading-none'>Price comparison with Payer Price <PiTrendUp className='h-4 w-4' /></div>
        <div className='leading-none text-muted-foreground'>Showing {chartData.length} CPT codes per comparison</div>
      </CardFooter>
    </Card>
  );
};

export default PayerPriceDataChart;