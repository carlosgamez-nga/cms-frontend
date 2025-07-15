// src/app/dashboard/components/recent-contracts/recent-contracts.tsx

import { FileText } from 'lucide-react';

import CustomIcon from '@/components/custom-icon';
import DataTable from '@/features/contracts/components/contracts-list/data-table';

// REMOVE THIS IMPORT:
// import { getContracts } from '@/features/contracts/queries/get-contracts'; // <-- REMOVE THIS LINE

import { columns } from '@/features/contracts/components/contracts-list/columns';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Contract } from '@/lib/types'; // Make sure Contract type is imported

// Modify the component to accept a 'contracts' prop
interface RecentContractsProps {
  contracts: Contract[]; // Define the type of the prop
}

// Modify the component signature
const RecentContracts = ({ contracts }: RecentContractsProps) => { // <-- ACCEPT contracts AS PROP
  // REMOVE THIS LINE:
  // const contracts = await getContracts(); // <-- REMOVE THIS LINE

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
        {/* Pass the received contracts prop to DataTable */}
        <DataTable columns={columns} data={contracts} isDashboard={true} />
      </div>
    </div>
  );
};

export default RecentContracts;