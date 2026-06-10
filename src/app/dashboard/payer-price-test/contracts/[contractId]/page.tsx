import { notFound } from 'next/navigation';
import KpiGrid from '@/app/dashboard/payer-price-test/components/KpiGrid';
import ContractHeader from '@/app/dashboard/payer-price-test/components/ContractHeader';
import CptRateTable, {
  ContractRateRow,
} from '@/app/dashboard/payer-price-test/components/CptRateTable';
import NegotiationOpportunityCard from '@/app/dashboard/payer-price-test/components/NegotiationOpportunityCard';
import RateAnalysisPanel from '@/app/dashboard/payer-price-test/components/RateAnalysisPanel';
import type { OverviewContract } from '@/app/dashboard/payer-price-test/components/contracts-table-columns';

type ContractDetailPageProps = {
  params: Promise<{
    contractId: string;
  }>;
};

const calculateVariance = (marketRate: number, contractRate: number) => {
  if (!marketRate) return 0;
  return ((contractRate - marketRate) / marketRate) * 100;
};

const getContractDuration = (effectiveDate: string, expirationDate: string) => {
  const start = new Date(effectiveDate);
  const end = new Date(expirationDate);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 'N/A';

  const msPerDay = 1000 * 60 * 60 * 24;
  const days = Math.max(0, Math.round((end.getTime() - start.getTime()) / msPerDay));
  const months = Math.round(days / 30);
  return `${months} months`;
};

const ContractDetailPage = async ({ params }: ContractDetailPageProps) => {
  const { contractId } = await params;
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
  const response = await fetch(`${apiBase}/contracts/${contractId}`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    notFound();
  }

  const contract = (await response.json()) as OverviewContract;
  const rates = (contract.rates || []) as ContractRateRow[];

  const avgRateVsMarket = rates.length
    ? rates.reduce(
        (acc, rate) => acc + calculateVariance(rate.market_rate, rate.contract_rate),
        0
      ) / rates.length
    : calculateVariance(contract.market_rate, contract.contract_rate);

  const avgDollarVariance = rates.length
    ? rates.reduce((acc, rate) => acc + (rate.contract_rate - rate.market_rate), 0) /
      rates.length
    : contract.contract_rate - contract.market_rate;

  const summaryItems = [
    {
      title: 'Total CPT Codes',
      value: contract.cpt_codes,
    },
    {
      title: 'Average Rate vs Market',
      value: `${avgRateVsMarket >= 0 ? '+' : ''}${avgRateVsMarket.toFixed(0)}%`,
    },
    {
      title: 'Contract Variance Avg',
      value: `${avgDollarVariance >= 0 ? '+' : ''}$${Math.abs(avgDollarVariance).toFixed(2)}`,
    },
    {
      title: 'Contract Duration',
      value: getContractDuration(contract.effective_date, contract.expiration_date),
    },
  ];

  return (
    <div className='space-y-6 mt-8 mb-8'>
      <ContractHeader contract={contract} />

      <KpiGrid items={summaryItems} />

      <CptRateTable rates={rates} />

      <NegotiationOpportunityCard rates={rates} />

      <RateAnalysisPanel initialPayer={contract.payer_name} />
    </div>
  );
};

export default ContractDetailPage;
