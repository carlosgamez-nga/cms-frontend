// app/dashboard/page.tsx (or app/page.tsx)

import { cookies } from 'next/headers';
import { fetchUserContracts } from '@/features/contracts/queries/get-contracts';
import { fetchUserDetails } from '@/features/auth/queries/get-user'; // <--- Import the new function
import Banner from './components/banner';
import ContractUpload from '@/features/contracts/components/contract-upload';
import Heading from './components/heading';
import CardsGrid from './components/cards/cards-grid';
import RecentContracts from './components/recent-contracts/recent-contracts';
import ContractsRevenue from './components/contracts-revenue/contracts-revenue';


export default async function Home() {
  const cookieStore = await cookies();
  const authToken = cookieStore.get('authToken')?.value;

  let contracts = [];
  let username = 'Guest'; // <--- Default username
  let user = null; // To store full user object

  if (authToken) {
    try {
      // Fetch user details
      user = await fetchUserDetails(authToken);
      username = user.username || 'User'; // Use fetched username, fallback to 'User'
      console.log('Home (Server): Fetched user details:', user);

      // Fetch contracts
      contracts = await fetchUserContracts(authToken);
      console.log('Home (Server): Fetched contracts using cookie token.');
    } catch (error) {
      console.error('Home (Server): Error fetching data with cookie token:', error);
      contracts = [];
      username = 'Guest'; // Reset username if fetching fails
    }
  } else {
    console.log('Home (Server): No auth token found in cookies. Data fetching skipped.');
  }

  return (
    <>
      {contracts.length < 1 ? (
        <>
          <Banner users_name={username} /> {/* <--- Pass the dynamic username */}
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
            <RecentContracts contracts={contracts} />
            <ContractsRevenue />
          </div>
        </>
      )}
    </>
  );
}