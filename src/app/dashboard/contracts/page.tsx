import { Suspense } from 'react';

import ContractUpload from '@/features/contracts/components/contract-upload';
import ContractList from '@/features/contracts/components/contracts-list/contract-list';
import Heading from '../components/heading';
import Spinner from '@/components/spinner';
import { Toaster } from 'sonner';

const ContractsPage = () => {
  return (
    <div className='flex-1 flex flex-col gap-y-4'>
      <Heading
        title='Your contracts'
        description='Browse all your contracts in one place. Use the table to sort and search through your contracts for easy tracking and management.'
      />

      <Toaster />
      <ContractUpload title='Add a new contract' />
      <Suspense fallback={<Spinner />}>
        <ContractList />
      </Suspense>
    </div>
  );
};

export default ContractsPage;
