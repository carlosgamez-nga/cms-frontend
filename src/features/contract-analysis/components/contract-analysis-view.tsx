'use client';

import CMSDataChart from '@/features/charts/components/cms-data-chart';
import { useCMSChartData } from '@/features/charts/hooks/use-cms-chart-data';
import ChartFilters from './chart-filters';
import DaaDetailsTable from './daa-details-table';

interface ContractAnalysisViewProps {
  initialState?: string;
  initialYear?: string;
}

const ContractAnalysisView = ({
  initialState,
  initialYear,
}: ContractAnalysisViewProps) => {
  const { chartData, filters, handleFilterChange, isLoading } = useCMSChartData({
    initialState,
    initialYear,
  });

  return (
    <div className='flex flex-col gap-4'>
      <ChartFilters filters={filters} onChange={handleFilterChange} />
      {isLoading ? (
        <div className='flex items-center justify-center h-64'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
        </div>
      ) : (
        <div className='flex flex-col xl:flex-row gap-4'>
          <div className='w-full xl:w-1/3'>
            <DaaDetailsTable data={chartData} />
          </div>
          <div className='w-full xl:w-2/3'>
            <CMSDataChart data={chartData} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ContractAnalysisView;
