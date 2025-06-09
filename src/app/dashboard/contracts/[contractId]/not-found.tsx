import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Placeholder from '@/components/placeholder';

const NotFound = () => {
  return (
    <div className='flex-1 flex'>
      <Placeholder
        label='Contract not found'
        button={
          <Button asChild variant='outline'>
            <Link href='dashboard/contracts/'>Back to contracts</Link>
          </Button>
        }
      />
    </div>
  );
};

export default NotFound;
