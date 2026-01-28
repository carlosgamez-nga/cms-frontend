import { notFound } from 'next/navigation';
import { getContract } from '@/features/contracts/queries/get-contracts.server';
import ContractChartsView from '@/features/contracts/components/ContractChartsView';

// 1. UPDATE THE INTERFACE
// params is now a Promise that resolves to the object
interface ContractPageProps {
  params: Promise<{
    contractId: string;
  }>;
}

export default async function ContractPage({ params }: ContractPageProps) {
  // 2. AWAIT THE PARAMS
  // Now TypeScript knows this is a Promise, and Next.js will be happy
  const { contractId } = await params;

  // 3. Fetch Data
  const contract = await getContract(contractId);

  if (!contract) {
    notFound();
  }

  return (
    <div className='space-y-6 mt-8'>
      <div className='flex justify-between items-center'>
        <h2 className='text-3xl font-bold'>{contract.title}</h2>
      </div>
      <ContractChartsView contract={contract} />
    </div>
  );
}