'use client';

import { useState } from 'react';
import { Contract } from '@/lib/types';
import { toast } from 'sonner';

// --- shadcn/ui Imports ---
// Make sure this import is present.
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import Spinner from '@/components/spinner';
// --- End Imports ---

// Import your charts
import CMSDataChart from '@/features/charts/components/cms-data-chart';
import PayerPriceDataChart from '@/features/charts/components/payer-price-data-chart';
import NewContractDataChart from '@/features/charts/components/new-contract-data-chart';

// Import the Server Action
import { fetchChartDataAction } from '../actions';

interface ContractChartsViewProps {
  contract: Contract;
}

export default function ContractChartsView({ contract }: ContractChartsViewProps) {
  const [cptInput, setCptInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cmsData, setCmsData] = useState<any[] | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setCmsData(null);

    const codes = cptInput.split(',').map(code => code.trim()).filter(Boolean);
    if (codes.length === 0 || codes.length > 10) {
      const errorMessage = codes.length === 0 
        ? 'Please enter at least one CPT code.' 
        : 'You may only request up to 10 CPT codes at a time.';
      setError(errorMessage);
      setIsLoading(false);
      return;
    }

    try {
      const params = {
        year: contract.year || '2025',
        carrier_number: contract.carrier_number || '00000',
        locality: contract.locality || '00',
        hcpcs_codes: codes,
      };

      const result = await fetchChartDataAction(params);
      if (result.error) throw new Error(result.error);
      
      setCmsData(result.data || []);
      toast.success('CMS analysis generated successfully!');
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // For debugging, you can check the state right before rendering
  console.log('CMS Data State:', cmsData);

  return (
    <div className='space-y-6'>
      {/* CPT Code Input Form */}
      <form onSubmit={handleSubmit} className='p-6 border rounded-lg bg-card text-card-foreground shadow-sm space-y-4'>
        <div className='space-y-2'>
          <Label htmlFor='cpt-codes-input'>Enter up to 10 CPT Codes for Analysis</Label>
          <p className='text-sm text-muted-foreground'>Separate codes with a comma (,).</p>
        </div>
        <div className='flex gap-4'>
          <Input
            id='cpt-codes-input'
            placeholder='e.g., 99213, 99214'
            value={cptInput}
            onChange={(e) => setCptInput(e.target.value)}
            disabled={isLoading}
            className='flex-grow'
          />
          <Button type='submit' disabled={isLoading}>
            {isLoading ? <Spinner /> : 'Generate Analysis'}
          </Button>
        </div>
        {error && <p className='text-sm font-medium text-destructive'>{error}</p>}
      </form>

      {/* --- TABS IMPLEMENTATION --- */}
      {/* This whole section will only render if cmsData is an array with items. */}
      {cmsData && cmsData.length > 0 && (
        <Tabs defaultValue="cms-analysis" className="w-full">
          {/* The Tab Selectors */}
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="cms-analysis">CMS vs Current Contract</TabsTrigger>
            <TabsTrigger value="payer-price-analysis">Payer Price vs Current Contract</TabsTrigger>
            <TabsTrigger value="new-contract-analysis">New Contract vs Current Contract</TabsTrigger>
          </TabsList>

          {/* Content for the CMS Analysis Tab */}
          <TabsContent value="cms-analysis" className='mt-6'>
            <CMSDataChart contractData={contract} cmsData={cmsData} />
          </TabsContent>

          {/* Content for the Payer Price Tab */}
          <TabsContent value="payer-price-analysis" className='mt-6'>
            {/* The actual chart component will replace this placeholder */}
            <PayerPriceDataChart contractData={contract} />
          </TabsContent>

          {/* Content for the New Contract Tab */}
          <TabsContent value="new-contract-analysis" className='mt-6'>
            {/* The actual chart component will replace this placeholder */}
            <NewContractDataChart contractData={contract} />
          </TabsContent>
        </Tabs>
      )}
      {/* --- END TABS IMPLEMENTATION --- */}
    </div>
  );
}