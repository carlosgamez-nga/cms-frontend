'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

import { Contract } from '@/lib/types';

export const columns: ColumnDef<Contract>[] = [
  {
    accessorKey: 'title',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Title
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => <div className='lowercase'>{row.getValue('title')}</div>,
  },
  {
    accessorKey: 'payer_name',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Payer name
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className='capitalize'>{row.getValue('payer_name')}</div>
    ),
  },
  {
    accessorKey: 'effective_date',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Effective date
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue('effective_date')}</div>,
  },
  {
    accessorKey: 'expiration_date',
    header: 'Renegotiation Date',
    cell: ({ row }) => {
      const date = row.getValue('expiration_date') as string;
      if (!date) return <div>--</div>;
      
      const isExpiringSoon = new Date(date).getTime() - new Date().getTime() < 90 * 24 * 60 * 60 * 1000;
      
      return (
        <div className="flex items-center gap-2">
          {date}
          {isExpiringSoon && (
            <span className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
              Expiring Soon
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'cpt_codes_count',
    header: 'CPT Codes',
    cell: ({ row }) => <div className="text-center">{row.getValue('cpt_codes_count')}</div>,
  },
  {
    accessorKey: 'avg_variance',
    header: 'Variance vs Market (%)',
    cell: ({ row }) => {
      const variance = Number(row.getValue('avg_variance') || 0);
      return (
        <div className={`text-right font-medium ${variance < 0 ? 'text-red-500' : 'text-green-500'}`}>
          {variance > 0 ? '+' : ''}{variance.toFixed(1)}%
        </div>
      );
    },
  },
  {
    accessorKey: 'link',
    header: 'Link',
    cell: ({ row }) => {
      const { id } = row.original;
      return (
        <Button asChild variant='link' size='sm'>
          <Link href={`/dashboard/contracts/${id}`}>Show contract...</Link>
        </Button>
      );
    },
  },
  // {
  //   accessorKey: 'amount',
  //   header: () => <div className='text-right'>Amount</div>,
  //   cell: ({ row }) => {
  //     const amount = parseFloat(row.getValue('amount'));
  //     // Format the amount as a dollar amount
  //     const formatted = new Intl.NumberFormat('en-US', {
  //       style: 'currency',
  //       currency: 'USD',
  //     }).format(amount);
  //     return <div className='text-right font-medium'>{formatted}</div>;
  //   },
  // },
  // {
  //   id: 'actions',
  //   header: 'Actions',
  //   cell: ({ row }) => {
  //     const { id } = row.original;
  //     return (
  //       <Button asChild variant='link' size='sm'>
  //         <Link href={`/dashboard/contracts/${id}`}>Show contract</Link>
  //       </Button>
  //     );
  //   },
  // },
];
