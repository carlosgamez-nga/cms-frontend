import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { OverviewContract } from './contracts-table-columns';

interface ContractHeaderProps {
  contract: OverviewContract;
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

const ContractHeader = ({ contract }: ContractHeaderProps) => {
  return (
    <Card className='bg-primary-foreground'>
      <CardHeader>
        <CardTitle className='text-2xl font-bold'>{contract.title}</CardTitle>
      </CardHeader>
      <CardContent className='space-y-1 text-sm'>
        <p>
          <span className='font-medium'>Payer:</span> {contract.payer_name}
        </p>
        <p>
          <span className='font-medium'>Status:</span> {contract.status}
        </p>
        <p>
          <span className='font-medium'>Effective:</span> {formatDate(contract.effective_date)}
        </p>
        <p>
          <span className='font-medium'>Expires:</span> {formatDate(contract.expiration_date)}
        </p>
      </CardContent>
    </Card>
  );
};

export default ContractHeader;
