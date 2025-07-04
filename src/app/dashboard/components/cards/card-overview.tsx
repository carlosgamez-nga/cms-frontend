import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PiCurrencyDollar } from 'react-icons/pi';

type OverviewCardProps = {
  title: string;
  amount: string;
  percentage: string;
};

const CardOverview = ({ title, amount, percentage }: OverviewCardProps) => {
  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2 '>
        <CardTitle className='text-sm font-medium'>{title}</CardTitle>
        <PiCurrencyDollar className='h-4 w-4 text-muted-foreground' />
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold'>${amount}</div>
        <p className='text-sm text-muted-foreground'>{percentage}%</p>
      </CardContent>
    </Card>
  );
};

export default CardOverview;
