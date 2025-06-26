import { notFound } from 'next/navigation';
// import ContractItem from '@/features/contract/components/contract-item';
// import { Suspense } from 'react';
// import Spinner from '@/components/spinner';
// import ChartCard from '@/components/chart-card';
import CodeList from '@/features/cpt-codes/components/code-list';

import { CodeCPT } from '@/lib/types';

import { getContract } from '@/features/contracts/queries/get-contract';
import { getCptCodes } from '@/features/cpt-codes/queries/get-codes';
import CMSDataChart from '@/features/charts/components/cms-data-chart';
import PayerPriceDataChart from '@/features/charts/components/payer-price-data-chart';
import NewContractDataChart from '@/features/charts/components/new-contract-data-chart';

type ContractProps = {
  params: {
    contractId: string;
  };
  codes: CodeCPT[];
};

const ContractPage = async ({ params }: ContractProps) => {
  const { contractId } = await params;
  const contract = await getContract(contractId);

  const codes_data = await getCptCodes();

  if (!contract) {
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

    // ---------------> OLD Layout <-----------------
    // <div className='flex flex-col justify-center w-full'>
    //   <div className='grid grid-cols-6 grid-row-2 gap-4 w-full items-start'>
    //     <div className='col-span-6 lg:col-span-2 lg:row-start-2'>
    //       <ContractItem contract={contract} isDetail data={codes_data} />
    //     </div>
    //     <div className='col-span-6 lg:col-span-4 lg:col-start-3'>
    //
    //     </div>
    //     <div className='col-span-6 lg:col-span-4'>
    //       <Suspense fallback={<Spinner />}>
    //         <ChartCard />
    //       </Suspense>
    //     </div>
    //   </div>
    // </div>
  );
};

export default ContractPage;
