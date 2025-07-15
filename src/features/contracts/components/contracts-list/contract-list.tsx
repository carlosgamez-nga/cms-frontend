// src/features/contracts/components/contract-list.tsx (Assuming this is the file)
'use client'; // <-- Keep this, as it's a Client Component

import * as React from 'react'; // Make sure React is imported
import { Contract } from '@/lib/types';
import { fetchUserContracts } from '@/features/contracts/queries/get-contracts'; // Correct import for user-specific fetch
import DataTable from '@/features/contracts/components/contracts-list/data-table';
import { columns } from '@/features/contracts/components/contracts-list/columns';
import Spinner from '@/components/spinner'; // Assuming you have a Spinner component

const ContractList = () => {
  const [contracts, setContracts] = React.useState<Contract[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const getContractsData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // 1. Fetch the authentication token from your new Next.js API Route
        const tokenRes = await fetch('/api/auth/get-token');
        if (!tokenRes.ok) {
          const errorData = await tokenRes.json().catch(() => ({}));
          throw new Error(errorData.message || 'Failed to retrieve authentication token.');
        }
        const { token } = await tokenRes.json();

        if (!token) {
          throw new Error('Authentication token not available after retrieval.');
        }

        // 2. Use the retrieved token to fetch user contracts
        const userContracts = await fetchUserContracts(token);
        setContracts(userContracts);

      } catch (err: any) {
        console.error('Error fetching contracts in ContractList:', err);
        setError(err.message || 'An unknown error occurred.');
        setContracts([]); // Clear contracts on error
      } finally {
        setIsLoading(false);
      }
    };

    getContractsData();
  }, []); // Empty dependency array: runs once on mount

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-64'>
        <Spinner /> {/* Show a loading spinner while fetching */}
      </div>
    );
  }

  if (error) {
    return (
      <div className='text-center text-red-500 p-4'>
        Error loading contracts: {error}
        {error.includes('Authentication required') && (
            <p>Please ensure you are logged in correctly.</p>
        )}
      </div>
    );
  }

  return (
    <div>
      {/* Pass the state-managed contracts to DataTable */}
      <DataTable columns={columns} data={contracts} isDashboard={false} /> {/* isDashboard set to false for full list */}
    </div>
  );
};

export default ContractList;