// app/dashboard/page.tsx (or app/page.tsx)

import { cookies } from 'next/headers';
import { fetchUserContracts } from '@/features/contracts/queries/get-contracts';
import Banner from './components/banner';
import ContractUpload from '@/features/contracts/components/contract-upload';
import Heading from './components/heading';
import CardsGrid from './components/cards/cards-grid';
import RecentContracts from './components/recent-contracts/recent-contracts'; // <-- Ensure this path is correct
import ContractsRevenue from './components/contracts-revenue/contracts-revenue';


export default async function Home() {
  const cookieStore = await cookies();
  const authToken = cookieStore.get('authToken')?.value;

  let contracts = [];

  if (authToken) {
    try {
      contracts = await fetchUserContracts(authToken);
      console.log('Home (Server): Fetched contracts using cookie token.');
    } catch (error) {
      console.error('Home (Server): Error fetching user contracts with cookie token:', error);
      contracts = [];
    }
  } else {
    console.log('Home (Server): No auth token found in cookies. Contracts fetching skipped.');
  }

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
            {/* --- PASS THE CONTRACTS PROP HERE --- */}
            <RecentContracts contracts={contracts} />
            <ContractsRevenue />
          </div>
        </>
      )}
    </>
  );
}