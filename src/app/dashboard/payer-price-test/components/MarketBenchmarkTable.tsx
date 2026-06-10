import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export interface BenchmarkRateRow {
  cpt: string;
  billing_class: 'Professional' | 'Facility';
  modifiers: string;
  negotiated_type: 'Per Case' | 'Percent of Medicare';
  median_price: number;
  percentile_25: number;
  percentile_50: number;
  contract_rate: number;
}

interface MarketBenchmarkTableProps {
  rows: BenchmarkRateRow[];
}

const MarketBenchmarkTable = ({ rows }: MarketBenchmarkTableProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Market Benchmark Results</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='max-h-[320px] overflow-auto'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>CPT Code</TableHead>
                <TableHead className='text-right'>Median Price</TableHead>
                <TableHead className='text-right'>25th Percentile</TableHead>
                <TableHead className='text-right'>50th Percentile</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.cpt}>
                  <TableCell>{row.cpt}</TableCell>
                  <TableCell className='text-right'>${row.median_price.toFixed(2)}</TableCell>
                  <TableCell className='text-right'>${row.percentile_25.toFixed(2)}</TableCell>
                  <TableCell className='text-right'>${row.percentile_50.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketBenchmarkTable;
