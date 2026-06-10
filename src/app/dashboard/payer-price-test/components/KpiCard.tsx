import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface KpiCardProps {
  title: string;
  value: string | number;
  trend?: string;
}

const KpiCard = ({ title, value, trend }: KpiCardProps) => {
  return (
    <Card className='bg-primary-foreground'>
      <CardHeader className='pb-2'>
        <CardTitle className='text-sm font-medium text-muted-foreground'>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className='text-2xl font-semibold leading-none'>{value}</p>
        {trend ? <p className='text-xs text-muted-foreground mt-2'>{trend}</p> : null}
      </CardContent>
    </Card>
  );
};

export default KpiCard;
