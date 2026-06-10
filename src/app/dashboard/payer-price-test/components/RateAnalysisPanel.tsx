'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PayerPriceAnalysisView from '@/features/payer-price/components/payer-price-analysis-view';

interface RateAnalysisPanelProps {
  initialPayer?: string;
}

const RateAnalysisPanel = ({ initialPayer }: RateAnalysisPanelProps) => {
  const [resetVersion, setResetVersion] = useState(0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rate Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='flex items-center justify-between gap-3 mb-4'>
          <p className='text-sm text-muted-foreground'>
            Investigate contract reimbursement rates using payer market benchmarks
            and CPT filters.
          </p>
          <Button
            type='button'
            size='sm'
            variant='secondary'
            onClick={() => setResetVersion((prev) => prev + 1)}
          >
            Reset Filters
          </Button>
        </div>
        <PayerPriceAnalysisView
          key={`rate-analysis-${resetVersion}`}
          initialFilters={{
            payer: initialPayer || '',
          }}
        />
      </CardContent>
    </Card>
  );
};

export default RateAnalysisPanel;
