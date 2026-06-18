'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

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
      // 2. Make the DELETE request to your Django API
      // NOTE: Ensure your auth token is passed here if your Next.js setup requires it
      const response = await fetch(`/api/contracts/${contractId}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Token ${your_auth_token}` <-- Add this if calling Django directly from the client
        },
      });

      if (response.ok) {
        // 3. Redirect to dashboard and force a cache refresh so the deleted contract disappears
        router.push('/dashboard');
        router.refresh(); 
      } else {
        alert('Failed to delete the contract. Please try again.');
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