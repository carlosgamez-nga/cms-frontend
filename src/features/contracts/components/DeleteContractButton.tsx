'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteContract } from '@/features/contracts/queries/delete-contract';

interface DeleteContractButtonProps {
  contractId: string | number;
}

export default function DeleteContractButton({ contractId }: DeleteContractButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    // 1. Native browser confirmation dialog
    const confirmed = window.confirm(
      "Are you sure you want to delete this contract? All associated rates will also be permanently deleted."
    );
    
    if (!confirmed) return;

    setIsDeleting(true);

    try {
      // 2. Call the server action to delete the contract securely
      const response = await deleteContract(contractId);

      if (response?.success) {
        // 3. Redirect to dashboard and force a cache refresh so the deleted contract disappears
        router.push('/dashboard');
        router.refresh(); 
      } else {
        alert(response?.error || 'Failed to delete the contract. Please try again.');
        setIsDeleting(false);
      }
    } catch (error) {
      console.error('Error deleting contract:', error);
      alert('An unexpected error occurred.');
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed transition-colors duration-200 shadow-sm"
    >
      {isDeleting ? 'Deleting...' : 'Delete Contract'}
    </button>
  );
}