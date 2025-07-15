// contract-list.tsx
'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import DataTable from './data-table';
import { columns } from './columns';
import { fetchUserContracts } from '@/features/contracts/queries/get-contracts';

const ContractList = () => {
  const [contracts, setContracts] = useState([]); // This will hold the array
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getContractsData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const data = await fetchUserContracts(); // `data` will now directly be the array of contracts

        setContracts(data); // The state is updated with the array
        toast.success('Contracts loaded successfully!');
      } catch (err) {
        console.error('Failed to fetch contracts:', err);
        setError('Failed to load contracts. Please try again.');
        toast.error('Failed to load contracts.');
      } finally {
        setIsLoading(false);
      }
    };

    getContractsData();
  }, []);

  if (isLoading) {
    return <div className="text-center py-8">Loading contracts...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div>
      {/* DataTable receives the array directly in its `data` prop */}
      <DataTable columns={columns} data={contracts} />
    </div>
  );
};

export default ContractList;