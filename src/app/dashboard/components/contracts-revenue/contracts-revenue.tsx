import CustomIcon from '@/components/custom-icon';
import { BarChart } from 'lucide-react';
import ChartContractsRevenue from '../charts/chart-contracts-revenue';

const ContractsRevenue = () => {
  return (
    <div className='shadow-sm bg-background rounded-lg p-4'>
      <div className='flex gap-x-2 items-center'>
        <CustomIcon icon={BarChart} />
        <p className='text-xl'>Contracts Revenue</p>
      </div>
      <ChartContractsRevenue />
    </div>
  );
};

export default ContractsRevenue;
