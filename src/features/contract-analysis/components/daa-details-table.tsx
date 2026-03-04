'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartDatum } from '@/features/charts/types';

interface DaaDetailsTableProps {
  data: ChartDatum[];
}

const DaaDetailsTable = ({ data }: DaaDetailsTableProps) => {
  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>DAA Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='max-h-[400px] overflow-auto'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead className='text-right'>CMS Price</TableHead>
                <TableHead className='text-right'>Current Contract</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.code}>
                  <TableCell className='font-medium'>{item.code}</TableCell>
                  <TableCell className='text-right'>
                    ${item.cms.toFixed(2)}
                  </TableCell>
                  <TableCell
                    className='text-right'
                    style={{ color: item.currentContractFill }}
                  >
                    ${item.current_contract.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default DaaDetailsTable;
