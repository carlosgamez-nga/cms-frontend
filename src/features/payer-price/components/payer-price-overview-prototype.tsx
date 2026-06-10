'use client';

import { useEffect, useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import DataTable from '@/features/contracts/components/contracts-list/data-table';
import Spinner from '@/components/spinner';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import KpiGrid from '@/app/dashboard/payer-price-test/components/KpiGrid';
import ContractHealthCard from '@/app/dashboard/payer-price-test/components/ContractHealthCard';
import PayerDistributionChart from '@/app/dashboard/payer-price-test/components/PayerDistributionChart';
import {
  OverviewContract,
  overviewContractsColumns,
} from '@/app/dashboard/payer-price-test/components/contracts-table-columns';
import {
  getPayerPriceOverview,
  PayerPriceOverviewRow,
} from '../queries/get-payer-price-overview';

type ServiceBenchmarkRow = {
  category: string;
  market_benchmark: number;
  contract_rate: number;
};

const chartConfig = {
  market_benchmark: {
    label: 'Market Benchmark',
    color: 'hsl(var(--chart-1))',
  },
  contract_rate: {
    label: 'Contract Rate',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

const getExpiryCountIn90Days = (contracts: OverviewContract[]) => {
  const now = new Date();
  const limit = new Date(now);
  limit.setDate(limit.getDate() + 90);

  return contracts.filter((contract) => {
    const expiry = new Date(contract.expiration_date);
    return expiry >= now && expiry <= limit;
  }).length;
};

const calculateAverageVariance = (contracts: OverviewContract[]) => {
  if (!contracts.length) return 0;

  const total = contracts.reduce((acc, contract) => {
    if (!contract.market_rate) return acc;
    const variance =
      ((contract.contract_rate - contract.market_rate) / contract.market_rate) * 100;
    return acc + variance;
  }, 0);

  return total / contracts.length;
};

const PayerPriceOverviewPrototype = () => {
  const [contracts, setContracts] = useState<OverviewContract[]>([]);
  const [overviewData, setOverviewData] = useState<PayerPriceOverviewRow[]>([]);
  const [serviceBenchmarks, setServiceBenchmarks] = useState<ServiceBenchmarkRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
        const [contractsRes, overview, serviceBenchmarksRes] = await Promise.all([
          fetch(`${apiBase}/api/my-contracts/`),
          getPayerPriceOverview(),
          fetch(`${apiBase}/payer_price_service_benchmarks`),
        ]);

        if (!contractsRes.ok) {
          throw new Error(`Failed to fetch contracts (${contractsRes.status})`);
        }

        if (!serviceBenchmarksRes.ok) {
          throw new Error(
            `Failed to fetch service benchmarks (${serviceBenchmarksRes.status})`
          );
        }

        const contractsData = (await contractsRes.json()) as OverviewContract[];
        const serviceData = (await serviceBenchmarksRes.json()) as ServiceBenchmarkRow[];

        setContracts(Array.isArray(contractsData) ? contractsData : []);
        setOverviewData(overview);
        setServiceBenchmarks(Array.isArray(serviceData) ? serviceData : []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load prototype overview data.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const kpis = useMemo(() => {
    const activeContracts = contracts.filter((contract) => contract.status === 'Active').length;
    const totalCptCodes = contracts.reduce(
      (acc, contract) => acc + (contract.cpt_codes || 0),
      0
    );
    const avgVariance = calculateAverageVariance(contracts);
    const expiringSoon = getExpiryCountIn90Days(contracts);

    return [
      {
        title: 'Active Contracts',
        value: activeContracts,
      },
      {
        title: 'Total CPT Codes',
        value: totalCptCodes,
      },
      {
        title: 'Avg Rate vs Market (%)',
        value: `${avgVariance >= 0 ? '+' : ''}${avgVariance.toFixed(0)}%`,
      },
      {
        title: 'Contracts Expiring in 90 Days',
        value: expiringSoon,
      },
    ];
  }, [contracts]);

  const contractHealth = useMemo(() => {
    const belowMarket = contracts.filter((contract) => {
      if (!contract.market_rate) return false;
      const variance =
        ((contract.contract_rate - contract.market_rate) / contract.market_rate) * 100;
      return variance < -5;
    }).length;

    const expiringSoon = getExpiryCountIn90Days(contracts);
    const pendingNegotiations = contracts.filter(
      (contract) => contract.status === 'Pending Renewal'
    ).length;

    return {
      belowMarket,
      expiringSoon,
      pendingNegotiations,
    };
  }, [contracts]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payer Price Overview</CardTitle>
          <CardDescription>Loading prototype flow data...</CardDescription>
        </CardHeader>
        <CardContent className='flex justify-center py-10'>
          <Spinner />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payer Price Overview</CardTitle>
          <CardDescription>Prototype data could not be loaded</CardDescription>
        </CardHeader>
        <CardContent className='text-destructive text-sm'>{error}</CardContent>
      </Card>
    );
  }

  return (
    <div className='space-y-6'>
      <KpiGrid items={kpis} />

      <div className='space-y-3'>
        <h3 className='text-lg font-semibold'>Contract Health</h3>
        <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4'>
          <ContractHealthCard
            title='Contracts Below Market (>5%)'
            value={contractHealth.belowMarket}
            status='High Risk'
            indicatorClassName='bg-red-100 text-red-700'
          />
          <ContractHealthCard
            title='Contracts Expiring in 90 Days'
            value={contractHealth.expiringSoon}
            status='Attention Needed'
            indicatorClassName='bg-yellow-100 text-yellow-700'
          />
          <ContractHealthCard
            title='Pending Negotiations'
            value={contractHealth.pendingNegotiations}
            status='In Progress'
            indicatorClassName='bg-blue-100 text-blue-700'
          />
        </div>
      </div>

      <div className='grid grid-cols-1 xl:grid-cols-3 gap-4'>
        <Card className='bg-primary-foreground'>
          <CardHeader>
            <CardTitle>Reimbursement Rate vs Market Benchmark</CardTitle>
            <CardDescription>
              Comparison of negotiated reimbursement rates against market benchmarks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <BarChart accessibilityLayer data={serviceBenchmarks}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey='category'
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis
                  tickFormatter={(value) => `$${value}`}
                  label={{
                    value: 'Allowed Amount ($)',
                    angle: -90,
                    position: 'insideLeft',
                    style: { textAnchor: 'middle' },
                  }}
                />
                <ChartTooltip content={<ChartTooltipContent indicator='dashed' />} />
                <ChartLegend />
                <Bar
                  dataKey='market_benchmark'
                  fill='var(--color-market_benchmark)'
                  radius={4}
                />
                <Bar
                  dataKey='contract_rate'
                  fill='var(--color-contract_rate)'
                  radius={4}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <PayerDistributionChart contracts={contracts} />
        <Card>
          <CardHeader>
            <CardTitle>Contracts Summary</CardTitle>
            <CardDescription>Top 5 contracts</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contract</TableHead>
                  <TableHead>Payer</TableHead>
                  <TableHead className='text-right'>CPT Codes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {overviewData.slice(0, 5).map((row) => (
                  <TableRow key={row.contract_id}>
                    <TableCell className='max-w-[180px] truncate'>
                      {row.contract_title}
                    </TableCell>
                    <TableCell>{row.payer_name}</TableCell>
                    <TableCell className='text-right'>{row.matched_codes}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <div>
        <h3 className='text-xl font-semibold'>All Contracts</h3>
        <p className='text-sm text-muted-foreground'>
          Contracts sourced from local mock data (`db.json`)
        </p>
        <DataTable
          columns={overviewContractsColumns}
          data={contracts}
          isDashboard={false}
          fullWidth
          getRowHref={(row) => `/dashboard/payer-price-test/contracts/${row.id}`}
        />
      </div>
    </div>
  );
};

export default PayerPriceOverviewPrototype;
