import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
// import { PiArrowsDownUp } from 'react-icons/pi';
import CPTCodesInfo from '../../../features/cpt-codes/components/cpt-codes-info';

const ChartCard = () => {
  return (
    <Card>
      <CardHeader>
        <div className='flex justify-between'>
          <div className='header-left'>
            <div>
              <span className='text-secondary-foreground'>
                Total non-facility fee Schedule amount
              </span>
            </div>
            <div className='flex gap-1 justify-start items-center'>
              <span className='text-3xl font-bold'>$105.55</span>
              <div className='flex gap-1 items-center'>
                <Badge>12%</Badge>
                <span className='text-secondary-foreground text-xs'>
                  vs last year
                </span>
              </div>
            </div>
          </div>
          {/* <div className='header-right'>
            <button className='flex justify-center items-center gap-1 text-secondary-foreground'>
              <PiArrowsDownUp size={16} /> <span className='text-xs'>Sort</span>
            </button>
          </div> */}
        </div>
      </CardHeader>
      <CardContent className='pl-0'>
        <CPTCodesInfo />
      </CardContent>
    </Card>
  );
};

export default ChartCard;
