import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ContractHealthCardProps {
  title: string;
  value: string | number;
  status?: string;
  indicatorClassName?: string;
}

const ContractHealthCard = ({
  title,
  value,
  status,
  indicatorClassName,
}: ContractHealthCardProps) => {
  return (
    <Card className='bg-primary-foreground'>
      <CardHeader className='pb-2'>
        <CardTitle className='text-sm font-medium text-muted-foreground'>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='flex items-center justify-between gap-3'>
          <p className='text-2xl font-semibold leading-none'>{value}</p>
          {status ? (
            <span
              className={`inline-flex text-xs rounded px-2 py-1 ${indicatorClassName || 'bg-muted text-muted-foreground'
                }`}
            >
              {status}
            </span>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
};

export default ContractHealthCard;
