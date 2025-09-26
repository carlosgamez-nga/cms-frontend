'use client';

import { useState, useEffect } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, TooltipProps } from 'recharts';
import { ChartConfig, ChartContainer, ChartLegend, ChartTooltip } from '@/components/ui/chart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Contract } from '@/lib/types';

// --- Chart-specific components ---
const ChartLegendContent = () => ( <div className='flex gap-1 mt-4 flex-wrap text-sm items-center justify-center lg:gap-4'> <LegendItem color='#2563eb' label='Contract Rate' /> <LegendItem color='#22c55e' label='Offer Rate' /> </div> );
const LegendItem = ({ color, label }: { color: string; label: string }) => ( <div className='flex items-center gap-2'><span className='inline-block h-3 w-3 rounded-full' style={{ backgroundColor: color }} /><span>{label}</span></div> );
const ChartTooltipContent = ({ payload = [] }: TooltipProps<any, any>) => { if (!payload || payload.length === 0) return null; const data = payload[0].payload; return ( <div className='rounded-md border bg-background p-3 shadow-sm'> <div className='font-medium text-sm mb-1'>Code: {data.code}</div> <ul className='space-y-1 text-sm'> <li className='flex items-center justify-between'><span className='text-muted-foreground'>Contract Rate:</span><span className='font-bold' style={{ color: '#2563eb' }}>${data.contract_rate.toFixed(2)}</span></li> <li className='flex items-center justify-between'><span className='text-muted-foreground'>Offer Rate:</span><span className='font-bold' style={{ color: '#22c55e' }}>${data.offer_rate.toFixed(2)}</span></li> </ul> </div> ); };
// ---

type ChartDatum = {
  code: string;
  contract_rate: number;
  offer_rate: number;
};

interface NewContractDataChartProps {
  contractData: Contract;
  analysisData: any[] | null;
  submittedCodes: string[];
}

const NewContractDataChart = ({ contractData, analysisData, submittedCodes }: NewContractDataChartProps) => {
  const [chartData, setChartData] = useState<ChartDatum[]>([]);

  useEffect(() => {
    if (analysisData && submittedCodes) {
      const analysisMap = new Map<string, any>(
        analysisData.map(item => [item.cpt_code, item])
      );
      
      const merged = submittedCodes.map((code) => {
        const analysisItem = analysisMap.get(code);
        return {
          code,
          contract_rate: parseFloat(analysisItem?.contract_rate || 0),
          offer_rate: parseFloat(analysisItem?.offer_rate || 0),
        };
      });
      setChartData(merged);
    }
  }, [analysisData, submittedCodes]);

  const chartConfig: ChartConfig = {
    contract_rate: { label: 'Contract Rate', color: '#2563eb' },
    offer_rate: { label: 'Offer Rate', color: '#22c55e' },
  };

  if (chartData.length === 0) {
    return ( <Card className='bg-primary-foreground flex items-center justify-center h-full min-h-[300px]'><CardHeader><CardTitle>New Contract vs Current</CardTitle><CardContent className='pt-4'><p className='text-muted-foreground'>No analysis data to display.</p></CardContent></CardHeader></Card> );
  }

  return (
    <Card className='bg-primary-foreground'>
      <CardHeader><CardTitle>New Contract vs Current Contract</CardTitle><CardDescription>Rate comparison by CPT code</CardDescription></CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="code" tickLine={false} tickMargin={10} axisLine={false} tickFormatter={(value) => String(value).slice(0, 5)} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="contract_rate" fill="var(--color-contract_rate)" radius={4} />
            <Bar dataKey="offer_rate" fill="var(--color-offer_rate)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default NewContractDataChart;