import { FileText } from 'lucide-react';

import CustomIcon from '@/components/custom-icon';
import DataTable from '@/features/contracts/components/contracts-list/data-table';

import { getContracts } from '@/features/contracts/queries/get-contracts';
import { columns } from '@/features/contracts/components/contracts-list/columns';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const RecentContracts = async () => {
  const contracts = await getContracts();

  return (
    <div className='shadow-sm bg-background rounded-lg p-4'>
      <div className='flex justify-between'>
        <div className='flex gap-x-2 items-center'>
          <CustomIcon icon={FileText} />
          <p className='text-xl'>Recent contracts</p>
        </div>
        <Button asChild variant='link' size='sm'>
          <Link href='/dashboard/contracts'>See all of your contracts...</Link>
        </Button>
      </div>
      <div>
        <DataTable columns={columns} data={contracts} isDashboard={true} />
      </div>
    </div>
  );
};

export default RecentContracts;
