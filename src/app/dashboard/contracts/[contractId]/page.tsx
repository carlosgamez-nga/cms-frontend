// app/dashboard/contracts/[contractId]/page.tsx

import { notFound } from 'next/navigation';
import { getContract } from '@/features/contracts/queries/get-contracts.server';

// Import the new Client Component we just created
import ContractChartsView from '@/features/contracts/components/ContractChartsView';

interface ContractPageProps {
  params: {
    contractId: string;
  };
}

// This remains a Server Component for the initial fast load.
export default async function ContractPage({ params }: ContractPageProps) {
  const { contractId } = params;

  // Its only job is to fetch the initial, non-interactive contract data.
  const contract = await getContract(contractId);

  if (!contract) {
    notFound();
  }

  return (
    <div className='space-y-6 mt-8'>
      <div className='flex justify-between items-center'>
        <h2 className='text-3xl font-bold'>{contract.title}</h2>
      </div>

      {/* 
        Render the new Client Component and pass the server-fetched
        contract data to it as a prop. This component will handle
        all user interaction from here.
      */}
      <ContractChartsView contract={contract} />
    </div>
  );
}