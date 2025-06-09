import { notFound } from 'next/navigation';
// import ContractItem from '@/features/contract/components/contract-item';
// import { Suspense } from 'react';
// import Spinner from '@/components/spinner';
// import ChartCard from '@/components/chart-card';
import CodeList from '@/features/cpt-codes/components/code-list';
import CodeBarChart from '@/features/cpt-codes/components/code-bar-chart';
import CodePieChart from '@/features/cpt-codes/components/code-pie-chart';
import { CodeCPT } from '../../types';
import { getContract } from '@/features/contracts/queries/get-contract';

type ContractProps = {
  params: {
    contractId: string;
  };
  codes: CodeCPT[];
};

const codes_data = [
  {
    code: '43200',
    current_rate: 515,
    current_percentage: 102.31,
    offer_rate: 600,
    offer_percentage: 119.19,
  },
  {
    code: '45380',
    current_rate: 515,
    current_percentage: 81.36,
    offer_rate: 600,
    offer_percentage: 94.79,
  },
  {
    code: '43239',
    current_rate: 515,
    current_percentage: 102.31,
    offer_rate: 600,
    offer_percentage: 119.19,
  },
  {
    code: '45378',
    current_rate: 515,
    current_percentage: 105.22,
    offer_rate: 600,
    offer_percentage: 122.58,
  },
  {
    code: '43450',
    current_rate: 515,
    current_percentage: 102.31,
    offer_rate: 600,
    offer_percentage: 119.19,
  },
];

const ContractPage = async ({ params }: ContractProps) => {
  const { contractId } = params;
  const contract = await getContract(contractId);

  if (!contract) {
    notFound();
  }

  return (
    <div className='space-y-6 mt-8'>
      <div className='flex justify-between items-center'>
        <h2 className='text-3xl font-bold'>{contract.title}</h2>
      </div>
      <CodeList codes={codes_data} />
      <div className='grid gap-6 md:grid-cols-2'>
        <CodeBarChart codes={codes_data} />
        <CodePieChart codes={codes_data} />
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
