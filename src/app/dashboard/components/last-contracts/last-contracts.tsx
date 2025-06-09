import { FileText } from 'lucide-react';

import CustomIcon from '@/components/custom-icon';
import DataTable from '@/features/contracts/components/contracts-list/data-table';

import { getContracts } from '../../../../features/contracts/queries/get-contracts';
import { columns } from '@/features/contracts/components/contracts-list/columns';

const LastContracts = async () => {
  const contracts = await getContracts();

  return (
    <div className='shadow-sm bg-background rounded-lg p-4'>
      <div className='flex gap-x-2 items-center'>
        <CustomIcon icon={FileText} />
        <p className='text-xl'>Last contracts</p>
      </div>
      <div>
        <DataTable columns={columns} data={contracts} isDashboard={true} />
      </div>
    </div>
  );
};

export default LastContracts;
