'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, ChevronRight, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

import { Contract } from '@/app/dashboard/types';

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
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => (
      <div className=' capitalize'>{row.getValue('description')}</div>
    ),
  },
  {
    accessorKey: 'state',
    header: 'State',
    cell: ({ row }) => (
      <div className=' capitalize'>{row.getValue('state')}</div>
    ),
  },
  {
    accessorKey: 'payer_name',
    header: 'Payer name',
    cell: ({ row }) => (
      <div className=' capitalize'>{row.getValue('payer_name')}</div>
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
    cell: ({ row }) => (
      <div className=' lowercase'>{row.getValue('effective_date')}</div>
    ),
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
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const { id } = row.original;
      return (
        <Button asChild variant='secondary' size='sm'>
          <Link href={`/dashboard/contracts/${id}`}>Show contract</Link>
        </Button>
      );
    },
  },
];
