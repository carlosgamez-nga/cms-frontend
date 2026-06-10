'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Contract } from '@/lib/types';

export interface OverviewContract extends Contract {
  status: 'Active' | 'Draft' | 'Pending Renewal';
  expiration_date: string;
  cpt_codes: number;
  market_rate: number;
  contract_rate: number;
  rates?: {
    cpt: string;
    description: string;
    market_rate: number;
    contract_rate: number;
  }[];
  benchmark_rates?: {
    cpt: string;
    billing_class: 'Professional' | 'Facility';
    modifiers: string;
    negotiated_type: 'Per Case' | 'Percent of Medicare';
    median_price: number;
    percentile_25: number;
    percentile_50: number;
    contract_rate: number;
  }[];
}

const formatDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  }).format(date);
};

const calculateVarianceVsMarket = (marketRate: number, contractRate: number) => {
  if (!marketRate) return 0;
  return ((contractRate - marketRate) / marketRate) * 100;
};

const getVarianceTextClass = (variance: number) => {
  if (variance < -5) return 'text-red-500';
  if (variance <= 0) return 'text-yellow-500';
  return 'text-green-600';
};

const isExpiringSoon = (expirationDate: string) => {
  const now = new Date();
  const limit = new Date(now);
  limit.setDate(limit.getDate() + 90);
  const expiry = new Date(expirationDate);
  if (Number.isNaN(expiry.getTime())) return false;
  return expiry >= now && expiry <= limit;
};

export const overviewContractsColumns: ColumnDef<OverviewContract>[] = [
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <Button
        variant='ghost'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Title
        <ArrowUpDown className='ml-2 h-4 w-4' />
      </Button>
    ),
    cell: ({ row }) => <div className='truncate max-w-[200px]'>{row.original.title}</div>,
  },
  {
    accessorKey: 'payer_name',
    header: 'Payer',
    cell: ({ row }) => <div>{row.original.payer_name}</div>,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <div>{row.original.status === 'Draft' ? 'Offer' : row.original.status}</div>,
  },
  {
    accessorKey: 'effective_date',
    header: 'Effective Date',
    cell: ({ row }) => <div>{formatDate(row.original.effective_date)}</div>,
  },
  {
    accessorKey: 'expiration_date',
    header: 'Renegotiation Date',
    cell: ({ row }) => {
      const soon = isExpiringSoon(row.original.expiration_date);
      return (
        <div className='flex items-center gap-2'>
          <span>{formatDate(row.original.expiration_date)}</span>
          {soon ? (
            <span className='bg-yellow-100 text-yellow-700 text-xs rounded px-2 py-1'>
              Expiring Soon
            </span>
          ) : null}
        </div>
      );
    },
  },
  {
    accessorKey: 'cpt_codes',
    header: 'CPT Codes',
    cell: ({ row }) => <div className='text-right'>{row.original.cpt_codes}</div>,
  },
  {
    id: 'variance_vs_market',
    header: 'Variance vs Market (%)',
    cell: ({ row }) => {
      const variance = calculateVarianceVsMarket(
        row.original.market_rate,
        row.original.contract_rate
      );
      const formatted = `${variance >= 0 ? '+' : ''}${variance.toFixed(0)}%`;
      return <div className={`text-right ${getVarianceTextClass(variance)}`}>{formatted}</div>;
    },
  },
  {
    accessorKey: 'link',
    header: 'Link',
    cell: ({ row }) => (
      <Button asChild variant='link' size='sm'>
        <Link href={`/dashboard/payer-price-test/contracts/${row.original.id}`}>
          View Contract
        </Link>
      </Button>
    ),
  },
];
