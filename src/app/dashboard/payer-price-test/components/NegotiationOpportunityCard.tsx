import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ContractRateRow } from './CptRateTable';

interface NegotiationOpportunityCardProps {
  rates: ContractRateRow[];
}

const variance = (marketRate: number, contractRate: number) => {
  if (!marketRate) return 0;
  return ((contractRate - marketRate) / marketRate) * 100;
};

const NegotiationOpportunityCard = ({ rates }: NegotiationOpportunityCardProps) => {
  const belowMarketRates = rates.filter(
    (rate) => variance(rate.market_rate, rate.contract_rate) < -5
  );
  const opportunityCount = belowMarketRates.length;

  const estimatedImprovement = rates.reduce((acc, rate) => {
    const diff = Math.max(0, rate.market_rate - rate.contract_rate);
    return acc + diff * 120;
  }, 0);

  const estimatedImprovementK = Math.round(estimatedImprovement / 1000);
  const largestVarianceRate = rates.reduce<ContractRateRow | null>((worst, current) => {
    if (!worst) return current;
    return variance(current.market_rate, current.contract_rate) <
      variance(worst.market_rate, worst.contract_rate)
      ? current
      : worst;
  }, null);
  const largestVariance = largestVarianceRate
    ? variance(largestVarianceRate.market_rate, largestVarianceRate.contract_rate)
    : 0;

  return (
    <Card className='bg-primary-foreground'>
      <CardHeader>
        <CardTitle>Negotiation Opportunities</CardTitle>
      </CardHeader>
      <CardContent className='space-y-1 text-sm'>
        <p>{opportunityCount} CPT codes below market benchmarks</p>
        <p className='text-muted-foreground'>
          Largest variance: {largestVariance.toFixed(0)}% (CPT{' '}
          {largestVarianceRate?.cpt || 'N/A'})
        </p>
        <p className='text-muted-foreground'>
          Estimated annual improvement: ${estimatedImprovementK}K annually
        </p>
      </CardContent>
    </Card>
  );
};

export default NegotiationOpportunityCard;
