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

// Import Server Actions
import { 
  fetchChartDataAction, 
  fetchPayerPriceAction,
  fetchContractRatesAction // The new Django fetcher
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
  
  // Data States
  const [cmsData, setCmsData] = useState<any[] | null>(null);
  const [payerPriceData, setPayerPriceData] = useState<any | null>(null);
  
  // This holds the actuals from your Django DB
  const [contractRates, setContractRates] = useState<any[] | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const codes = cptInput.split(',').map(code => code.trim()).filter(Boolean);
    
    if (codes.length === 0 || codes.length > 10) {
      setError(codes.length === 0 ? 'Please enter at least one CPT code.' : 'You may only request up to 10 CPT codes.');
      return;
    }

    // Reset State
    setError(null);
    setCmsData(null);
    setPayerPriceData(null);
    setContractRates(null); 
    setSubmittedCodes(codes);
    
    // Fetch data for the active tab immediately
    fetchDataForTab(activeTab, codes);
  };

  const fetchDataForTab = async (tab: string, codes: string[]) => {
    if (codes.length === 0) return;
    setIsLoading(true);
    setError(null);

    try {
      // 1. Always fetch the Contract Rates (The "Actuals")
      // We do this in parallel with the benchmark data using Promise.all
      const contractRatesPromise = fetchContractRatesAction(contract.id, codes);

      if (tab === 'cms-analysis') {
        const params = { 
            year: contract.year || '2025', 
            carrier_number: contract.carrier_number || '00000', 
            locality: contract.locality || '00', 
            hcpcs_codes: codes 
        };
        const cmsPromise = fetchChartDataAction(params);

        // Await both simultaneously for speed
        const [contractRes, cmsRes] = await Promise.all([contractRatesPromise, cmsPromise]);

        const rawContractData = contractRes.data;
        const cleanContractList = Array.isArray(rawContractData) 
            ? rawContractData 
            : rawContractData?.results || [];

        console.log("------------------------------------------");
        console.log("🏥 CMS DATA DEBUG:");
        const rawCms = cmsRes.data;

        if (Array.isArray(rawCms)) {
            console.log(`✅ CMS is an Array with ${rawCms.length} items`);
            if (rawCms.length > 0) {
                console.log("🔍 First CMS Item:", rawCms[0]);
                console.log("🔑 Keys:", Object.keys(rawCms[0]));
            }
        } else if (rawCms && rawCms.results) {
            console.log("⚠️ CMS is Paginated! (Need to unwrap .results)");
            console.log("Results count:", rawCms.results.length);
        } else {
            console.log("❌ CMS Data is empty or invalid:", rawCms);
        }
        console.log("------------------------------------------");

        if (contractRes.error) throw new Error(contractRes.error);
        if (cmsRes.error) throw new Error(cmsRes.error);

        // 3. SET STATE WITH CLEAN LIST
        // Now your chart will get the Array it expects, not the pagination Object
        setContractRates(cleanContractList); 
        setCmsData(cmsRes.data || []);
        toast.success('CMS comparison generated!');

      } else if (tab === 'payer-price-analysis') {
        const payerApiValueMap: { [key: string]: string } = { 'UHC': 'United' };
        const payerApiValue = payerApiValueMap[contract.payer_name] || contract.payer_name;
        
        const params = {
          benchmarkType: "marketOverview", 
          payers: [{ value: payerApiValue, title: "", grouping: null }], 
          states: [contract.state],
          billingCodeAndTypes: codes.map(c => ({ value: { code: c, type: "CPT" }, title: "", grouping: null, description: null })),
          taxonomies: [{ value: "208D00000X", title: "", grouping: null }], 
          serviceCodes: [{ value: "11", title: "", grouping: null }],
          yearMonths: [{ value: { year: 2025, month: 6 }, title: "", grouping: null }],
          counties: null, billingCodeModifiers: null, billingClasses: null, entityTypes: null, includeIndirectNpis: false, negotiatedTypes: null,
        };

        const payerPromise = fetchPayerPriceAction(params);

        // Await both
        const [contractRes, payerRes] = await Promise.all([contractRatesPromise, payerPromise]);

        if (contractRes.error) throw new Error(contractRes.error);
        if (payerRes.error) throw new Error(payerRes.error);

        setContractRates(contractRes.data || []);
        setPayerPriceData(payerRes.data);
        toast.success('Payer Price comparison generated!');
      }

    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred fetching data");
      toast.error(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='space-y-6'>
      {/* Input Form */}
      <div className='p-6 border rounded-lg bg-card text-card-foreground shadow-sm'>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-1.5'>
            <Label htmlFor='cpt-codes-input' className='text-base font-semibold'>
              Enter up to 10 CPT Codes for Analysis
            </Label>
            <p className='text-sm text-muted-foreground'>
              Compare your extracted contract rates against CMS and Market benchmarks.
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
              {isLoading ? <Spinner /> : 'Compare Rates'}
            </Button>
          </div>
          {error && <p className='text-sm font-medium text-destructive'>{error}</p>}
        </form>
      </div>

      {/* Tabs - Reduced to 2 */}
      {submittedCodes.length > 0 && (
        <Tabs
          value={activeTab}
          onValueChange={(newTab) => {
            setActiveTab(newTab);
            // Refetch if we switch tabs and don't have the specific benchmark data yet
            if (submittedCodes.length > 0) {
                if (newTab === 'cms-analysis' && !cmsData) {
                    fetchDataForTab(newTab, submittedCodes);
                } else if (newTab === 'payer-price-analysis' && !payerPriceData) {
                    fetchDataForTab(newTab, submittedCodes);
                }
            }
          }}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="cms-analysis">CMS vs Contract</TabsTrigger>
            <TabsTrigger value="payer-price-analysis">Payer Price vs Contract</TabsTrigger>
          </TabsList>

        <TabsContent value="cms-analysis" className='mt-6'>
          {(isLoading && activeTab === 'cms-analysis') && <Spinner />}
          {cmsData && (
            <CMSDataChart
              contractData={contract}
              cmsData={cmsData}
              submittedCodes={submittedCodes}
              // Pass the extracted rates here
              analysisData={contractRates} 
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
              // Pass the extracted rates here
              analysisData={contractRates}
            />
          )}
        </TabsContent>
          </Tabs>
        )}
    </div>
  );
}