// app/dashboard/page.tsx

import { getContractsOnServer } from '@/features/contracts/queries/get-contracts.server';
import { getUserDetailsOnServer } from '@/features/auth/queries/get-user.server';

import Banner from './components/banner';
import ContractUpload from '@/features/contracts/components/contract-upload';
import Heading from './components/heading';
import CardsGrid from './components/cards/cards-grid';
import RecentContracts from './components/recent-contracts/recent-contracts';
import ContractsRevenue from './components/contracts-revenue/contracts-revenue';

export const dynamic = 'force-dynamic';

// This is a Server Component, so it can be async.
export default async function Home() {
  // --- REFACTORED DATA FETCHING LOGIC ---
  // 1. We no longer need to manually get cookies or the token here.
  //    The helper functions in 'get-contracts' and 'get-user' will do it for us.

  // 2. We can fetch both user details and contracts in parallel for better performance.
  const [user, contracts] = await Promise.all([
    getUserDetailsOnServer(), // This function will get the token and call Django.
    getContractsOnServer(),   // This function will also get the token and call Django.
  ]);
  
  // 3. The username defaults to 'Guest' if the user object is null (not logged in).
  const username = user?.username || 'Guest';
  const displayUsername = username.charAt(0).toUpperCase() + username.slice(1);

  // The rest of your component's JSX logic remains largely the same.
  return (
    <>
      {contracts.length < 1 ? (
        <>
          <Banner users_name={displayUsername} /> {/* Pass the dynamic username */}
          <ContractUpload title='Upload a contract to get started' />
        </>
      ) : (
        <>
          <Heading
            title={`${displayUsername}'s Dashboard`}
            description='Here you can see a summary of up to 5 of your most recent contracts.'
          />
          {/*<CardsGrid */}
          <div className='grid grid-cols-1 xl:grid-cols-2 md:gap-x-10 mt-8 gap-y-4'>
            <RecentContracts contracts={contracts} />
            <ContractsRevenue />
          </div>
        </>
      )}
    </>
  );
}