// app/dashboard/contracts/[contractId]/page.tsx

import { notFound } from 'next/navigation';
import { cookies } from 'next/headers'; // <-- IMPORT cookies
import { getContract } from '@/features/contracts/queries/get-contracts';
import { getCptCodes } from '@/features/cpt-codes/queries/get-codes';
import CMSDataChart from '@/features/charts/components/cms-data-chart';
import PayerPriceDataChart from '@/features/charts/components/payer-price-data-chart';
import NewContractDataChart from '@/features/charts/components/new-contract-data-chart';
import CodeList from '@/features/cpt-codes/components/code-list'; // Assuming this uses CodeCPT[]

import { CodeCPT, Contract } from '@/lib/types'; // Ensure Contract is also imported

type ContractProps = {
  params: {
    contractId: string;
  };
  // codes: CodeCPT[]; // This prop isn't used in the function signature, can be removed or ensure it's passed if intended.
};

const ContractPage = async ({ params }: ContractProps) => {
  // --- FIX 1: Correctly get contractId (no await needed for params) ---
  const { contractId } = params;
  // --- END FIX 1 ---

  // --- FIX 2: Get authToken from cookies ---
  const cookieStore = await cookies();
  const authToken = cookieStore.get('authToken')?.value;
  // --- END FIX 2 ---

  if (!authToken) {
    console.warn('No auth token found for ContractPage. Redirecting to login or showing not found.');
    // You might want to redirect to login or show a specific unauthorized page
    notFound(); // Or redirect('/login');
  }

  // --- FIX 3: Pass authToken to getContract ---
  const contract = await getContract(contractId, authToken); // <-- Pass the authToken
  // --- END FIX 3 ---

  const codes_data = await getCptCodes(); // Assuming getCptCodes does not need auth or gets it internally

  if (!contract) {
    console.warn(`Contract with ID ${contractId} not found after authenticated fetch.`);
    notFound();
  }

  return (
    <div className='space-y-6 mt-8'>
      <div className='flex justify-between items-center'>
        <h2 className='text-3xl font-bold'>{contract.title}</h2>
      </div>
      <CodeList codes={codes_data} />
      <div className='grid gap-6 grid-cols-6 grid-row-2'>
        <div className='col-span-6 lg:col-span-2'>
          <CMSDataChart />
        </div>
        <div className='col-span-6 lg:col-span-2'>
          <PayerPriceDataChart />
        </div>
        <div className='col-span-6 lg:col-span-2'>
          <NewContractDataChart />
        </div>
      </div>
    </div>
  );
};

export default ContractPage;