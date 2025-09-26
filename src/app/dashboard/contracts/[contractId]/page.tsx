// app/dashboard/contracts/[contractId]/page.tsx

import { notFound } from 'next/navigation';
import { getContract } from '@/features/contracts/queries/get-contracts.server';
import ContractChartsView from '@/features/contracts/components/ContractChartsView';

interface ContractPageProps {
  params: {
    contractId: string;
  };
}

export default async function ContractPage({ params }: ContractPageProps) {
  const { contractId } = params;

  // This page now only fetches the primary contract object.
  // All on-demand chart data will be fetched by the client component below.
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
        Pass ONLY the contract data down. The component will handle the rest.
        We no longer pass initialAnalysisData.
      */}
      <ContractChartsView contract={contract} />
    </div>
  );
}