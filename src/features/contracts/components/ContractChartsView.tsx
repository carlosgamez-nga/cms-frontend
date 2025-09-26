'use client';

import { useState } from 'react';
import { Contract } from '@/lib/types';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import Spinner from '@/components/spinner';

import CMSDataChart from '@/features/charts/components/cms-data-chart';
import PayerPriceDataChart from '@/features/charts/components/payer-price-data-chart';
import NewContractDataChart from '@/features/charts/components/new-contract-data-chart';

// Import ALL THREE Server Actions
import { 
  fetchChartDataAction, 
  fetchPayerPriceAction,
  fetchNewContractAnalysisAction 
} from '../actions';

interface ContractChartsViewProps {
  contract: Contract;
}

export default function ContractChartsView({ contract }: ContractChartsViewProps) {
  const [cptInput, setCptInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('cms-analysis');
  const [submittedCodes, setSubmittedCodes] = useState<string[]>([]);
  
  // State for each data source
  const [cmsData, setCmsData] = useState<any[] | null>(null);
  const [payerPriceData, setPayerPriceData] = useState<any | null>(null);
  const [newContractData, setNewContractData] = useState<any[] | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const codes = cptInput.split(',').map(code => code.trim()).filter(Boolean);
    if (codes.length === 0 || codes.length > 10) {
      setError(codes.length === 0 ? 'Please enter at least one CPT code.' : 'You may only request up to 10 CPT codes.');
      return;
    }
    // Reset all data on a new submission
    setError(null);
    setCmsData(null);
    setPayerPriceData(null);
    setNewContractData(null);
    setSubmittedCodes(codes);
    // Fetch data for the currently active tab
    fetchDataForTab(activeTab, codes);
  };

  const fetchDataForTab = async (tab: string, codes: string[]) => {
    if (codes.length === 0) return;
    setIsLoading(true);
    setError(null);

    try {
      if (tab === 'cms-analysis') {
        const params = { year: contract.year || '2025', carrier_number: contract.carrier_number || '00000', locality: contract.locality || '00', hcpcs_codes: codes };
        const result = await fetchChartDataAction(params);
        if (result.error) throw new Error(result.error);
        setCmsData(result.data || []);
        toast.success('CMS analysis generated!');
      } else if (tab === 'payer-price-analysis') {
        const payerApiValueMap: { [key: string]: string } = { 'UHC': 'United' };
        const payerApiValue = payerApiValueMap[contract.payer_name] || contract.payer_name;
        const params = {
          benchmarkType: "marketOverview", payers: [{ value: payerApiValue, title: "", grouping: null }], states: [contract.state],
          billingCodeAndTypes: codes.map(c => ({ value: { code: c, type: "CPT" }, title: "", grouping: null, description: null })),
          taxonomies: [{ value: "208D00000X", title: "", grouping: null }], serviceCodes: [{ value: "11", title: "", grouping: null }],
          yearMonths: [{ value: { year: 2025, month: 6 }, title: "", grouping: null }],
          counties: null, billingCodeModifiers: null, billingClasses: null, entityTypes: null, includeIndirectNpis: false, negotiatedTypes: null,
        };
        const result = await fetchPayerPriceAction(params);
        if (result.error) throw new Error(result.error);
        setPayerPriceData(result.data);
        toast.success('Payer Price analysis generated!');
      } else if (tab === 'new-contract-analysis') {
        const params = {
            baseline_id: 'ad1cffa2367a58b44a8adebd9dd00e9a', // Hardcoded for now
            cpt_codes: codes,
        };
        const result = await fetchNewContractAnalysisAction(params);
        if (result.error) throw new Error(result.error);
        setNewContractData(result.data || []);
        toast.success('New Contract analysis generated!');
      }
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='space-y-6'>
      {/* CPT Code Input Form */}
      <div className='p-6 border rounded-lg bg-card text-card-foreground shadow-sm'>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-1.5'>
            <Label htmlFor='cpt-codes-input' className='text-base font-semibold'>
              Enter up to 10 CPT Codes for Analysis
            </Label>
            <p className='text-sm text-muted-foreground'>
              Separate codes with a comma (,).
            </p>
          </div>
          <div className='flex flex-col sm:flex-row w-full items-center gap-2'>
            <Input
              id='cpt-codes-input'
              placeholder='e.g., 99213, 99214, 99215'
              value={cptInput}
              onChange={(e) => setCptInput(e.target.value)}
              disabled={isLoading}
              className='flex-grow'
            />
            <Button type='submit' disabled={isLoading} className='w-full sm:w-auto'>
              {isLoading ? <Spinner /> : 'Generate Analysis'}
            </Button>
          </div>
          {error && <p className='text-sm font-medium text-destructive'>{error}</p>}
        </form>
      </div>

      {/* Tabs and Charts */}
      {submittedCodes.length > 0 && (
        <Tabs
          value={activeTab}
          onValueChange={(newTab) => {
            setActiveTab(newTab);
            if (submittedCodes.length > 0) { // Ensure codes have been submitted before fetching
                if (newTab === 'cms-analysis' && !cmsData) {
                    fetchDataForTab(newTab, submittedCodes);
                } else if (newTab === 'payer-price-analysis' && !payerPriceData) {
                    fetchDataForTab(newTab, submittedCodes);
                } else if (newTab === 'new-contract-analysis' && !newContractData) {
                    fetchDataForTab(newTab, submittedCodes);
                }
            }
          }}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="cms-analysis">CMS vs Current</TabsTrigger>
            <TabsTrigger value="payer-price-analysis">Payer Price vs Current</TabsTrigger>
            <TabsTrigger value="new-contract-analysis">New Contract vs Current</TabsTrigger>
          </TabsList>

        <TabsContent value="cms-analysis" className='mt-6'>
          {(isLoading && activeTab === 'cms-analysis') && <Spinner />}
          {cmsData && (
            <CMSDataChart
              contractData={contract}
              cmsData={cmsData}
              submittedCodes={submittedCodes}
              // --- ADD THIS PROP ---
              // Pass the analysis data to the CMS chart
              analysisData={newContractData} 
            />
          )}
        </TabsContent>

        <TabsContent value="payer-price-analysis" className='mt-6'>
          {(isLoading && activeTab === 'payer-price-analysis') && <Spinner />}
          {payerPriceData && (
            <PayerPriceDataChart
              contractData={contract}
              payerPriceData={payerPriceData}
              submittedCodes={submittedCodes}
              // --- ADD THIS PROP ---
              // Pass the analysis data to the Payer Price chart
              analysisData={newContractData}
            />
          )}
        </TabsContent>
        
        <TabsContent value="new-contract-analysis" className='mt-6'>
          {(isLoading && activeTab === 'new-contract-analysis') && <Spinner />}
          {newContractData && (
            <NewContractDataChart
              contractData={contract}
              analysisData={newContractData}
              submittedCodes={submittedCodes}
            />
          )}
        </TabsContent>
          </Tabs>
        )}
    </div>
  );
}