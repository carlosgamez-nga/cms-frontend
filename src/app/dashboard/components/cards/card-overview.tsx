import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PiCurrencyDollar } from 'react-icons/pi';

const CardOverview = () => {
  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2 '>
        <CardTitle className='text-sm font-medium'>Your rate</CardTitle>
        <PiCurrencyDollar className='h-4 w-4 text-muted-foreground' />
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold'>$515.00</div>
        <p className='text-sm text-muted-foreground'>-17.19%</p>
      </CardContent>
    </Card>
  );
};

export default CardOverview;
