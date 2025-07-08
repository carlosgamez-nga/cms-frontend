import CardsGrid from './components/cards/cards-grid';
import ContractsRevenue from './components/contracts-revenue/contracts-revenue';
import Heading from './components/heading';
import RecentContracts from './components/recent-contracts/recent-contracts';

import { getContracts } from '@/features/contracts/queries/get-contracts';
import Banner from './components/banner';
import ContractUpload from '@/features/contracts/components/contract-upload';

export default async function Home() {
  const contracts = await getContracts();

  return (
    <>
      {contracts.length < 1 ? (
        <>
          <Banner users_name='Dianne' />
          <ContractUpload title='Upload a contract to get started' />
        </>
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
    </>
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
