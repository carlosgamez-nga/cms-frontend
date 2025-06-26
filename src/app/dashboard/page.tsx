import ContractUpload from '@/features/contracts/components/contract-upload';
import CardsGrid from './components/cards/cards-grid';
import ContractsRevenue from './components/contracts-revenue/contracts-revenue';
import Heading from './components/heading';
import RecentContracts from './components/recent-contracts/recent-contracts';

import { getContracts } from '@/features/contracts/queries/get-contracts';

export default async function Home() {
  const contracts = await getContracts();

  return (
    <div>
      {contracts.length < 1 ? (
        <div className='mt-4 shadow-md rounded p-4 w-9/12'>
          <ContractUpload title='Please upload a contract to get started' />
        </div>
      ) : (
        <>
          <Heading
            title='Your Dashboard'
            description='Here you can see a summary of up to 5 of your most recent contracts.'
          />
          <CardsGrid />
          <div className='grid grid-cols-1 xl:grid-cols-2 md:gap-x-10 mt-8 gap-y-4'>
            <RecentContracts />
            <ContractsRevenue />
          </div>
        </>
      )}
    </div>
  );
  // <div className='grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-4'>
  //   <div className='rounded-lg lg:col-span-2 xl:col-span-1 2xl:col-span-2'></div>
  //   <div className='bg-primary-foreground p-4 rounded-lg'>test</div>
  //   <div className='bg-primary-foreground p-4 rounded-lg'>test</div>
  //   <div className='bg-primary-foreground p-4 rounded-lg'>test</div>
  //   <div className='rounded-lg lg:col-span-2 xl:col-span-1 2xl:col-span-2'></div>
  //   <div className='bg-primary-foreground p-4 rounded-lg'>test</div>
  // </div>
}
