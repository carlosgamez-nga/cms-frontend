'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PayerPriceDataChart from './payer-price-data-chart';
import PayerPriceDataTable from './payer-price-data-table';
import PayerPriceFilters from './payer-price-filters';
import { usePayerPriceChartData } from '../hooks/use-payer-price-chart-data';
import { PayerPriceFilterValues } from '../types';

interface PayerPriceAnalysisViewProps {
  initialFilters?: Partial<PayerPriceFilterValues>;
}

const PayerPriceAnalysisView = ({ initialFilters }: PayerPriceAnalysisViewProps) => {
  const {
    rows,
    chartData,
    chartConfig,
    filters,
    isLoading,
    error,
    handleFilterChange,
  } = usePayerPriceChartData({ initialFilters });

  return (
    <div className='flex flex-col gap-4'>
      <PayerPriceFilters filters={filters} onChange={handleFilterChange} />
      {isLoading ? (
        <div className='flex items-center justify-center h-64'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
        </div>
      ) : null}

      {!isLoading && error ? (
        <Card>
          <CardHeader>
            <CardTitle>Unable to load market rates</CardTitle>
          </CardHeader>
          <CardContent className='text-sm text-destructive'>{error}</CardContent>
        </Card>
      ) : null}

      {!isLoading && !error ? (
        <div className='flex flex-col xl:flex-row gap-4'>
          <div className='w-full xl:w-2/3'>
            <PayerPriceDataChart data={chartData} config={chartConfig} />
          </div>
          <div className='w-full xl:w-1/3'>
            <PayerPriceDataTable rows={rows} />
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default PayerPriceAnalysisView;
