// app/dashboard/contracts/[contractId]/page.tsx

import { notFound } from 'next/navigation';
import { cookies } from 'next/headers'; // <-- IMPORT cookies
import { getContract } from '@/features/contracts/queries/get-contracts';
import { getCptCodes } from '@/features/cpt-codes/queries/get-codes';
import ContractAnalysisView from '@/features/contract-analysis/components/contract-analysis-view';
import NewContractDataChart from '@/features/charts/components/new-contract-data-chart';
import PayerPriceAnalysisView from '@/features/payer-price/components/payer-price-analysis-view';
import CodeList from '@/features/cpt-codes/components/code-list'; // Assuming this uses CodeCPT[]

import { CodeCPT, Contract } from '@/lib/types'; // Ensure Contract is also imported

type ContractProps = {
  params: Promise<{
    contractId: string;
  }>;
  // codes: CodeCPT[];
};

const ContractPage = async ({ params }: ContractProps) => {
  // --- FIX 1: Correctly get contractId (await params) ---
  const { contractId } = await params;
  // --- END FIX 1 ---

  // --- FIX 2: Get authToken from cookies ---
  const cookieStore = await cookies();
  // FALLBACK: Use 'mock-token' if no cookie, to allow frontend isolation/testing
  const authToken = cookieStore.get('authToken')?.value || 'mock-token';
  // --- END FIX 2 ---

  // --- FIX 3: Pass authToken to getContract ---
  const contract = await getContract(contractId, authToken);

  const codes_data = await getCptCodes();

  if (!contract) {
    console.warn(
      `Contract with ID ${contractId} not found after authenticated fetch.`,
    );
    notFound();
  }

  return (
    <div className='space-y-6 mt-8'>
      <div className='flex justify-between items-center'>
        <h2 className='text-3xl font-bold'>{contract.title}</h2>
      </div>
      <CodeList codes={codes_data} />
      <div className='grid gap-6 grid-cols-6 grid-row-2'>
        <div className='col-span-6 lg:col-span-6'>
          <ContractAnalysisView
            initialState={contract.state}
            initialYear={
              contract.effective_date
                ? new Date(contract.effective_date).getFullYear().toString()
                : ''
            }
          />
        </div>
        <div className='col-span-6 lg:col-span-6'>
          <PayerPriceAnalysisView
            initialFilters={{
              payer: contract.payer_name || '',
            }}
          />
        </div>
        <div className='col-span-6 lg:col-span-2'>
          <NewContractDataChart />
        </div>
      </div>
    </div>
  );
};

export default ContractPage;
