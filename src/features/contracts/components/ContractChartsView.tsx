'use client';

import { useState } from 'react';
import { Contract } from '@/lib/types';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Spinner from '@/components/spinner';

import CMSDataChart from '@/features/charts/components/cms-data-chart';
import PayerPriceDataChart from '@/features/charts/components/payer-price-data-chart';

// Import Server Actions
import { 
  fetchChartDataAction, 
  fetchPayerPriceAction,
  fetchContractRatesAction
} from '../actions';

interface ContractChartsViewProps {
  contract: Contract;
}

export default function ContractChartsView({ contract }: ContractChartsViewProps) {
  // Existing States
  const [cptInput, setCptInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('cms-analysis');
  const [submittedCodes, setSubmittedCodes] = useState<string[]>([]);
  
  // Data States
  const [cmsData, setCmsData] = useState<any[] | null>(null);
  const [payerPriceData, setPayerPriceData] = useState<any | null>(null);
  const [contractRates, setContractRates] = useState<any[] | null>(null);

  // New Filter Placeholder States (Optional: connect these to API calls later)
  const [payerInput, setPayerInput] = useState(contract.payer_name || 'UHC');
  const [taxonomyInput, setTaxonomyInput] = useState('');
  const [billingClass, setBillingClass] = useState('');
  const [modifiers, setModifiers] = useState('');
  const [negotiatedType, setNegotiatedType] = useState('Any');

  const handleSubmit = async (event?: React.FormEvent<HTMLFormElement>) => {
    if (event) event.preventDefault();
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
    
    // Fetch data for the active tab
    fetchDataForTab(activeTab, codes);
  };

  const resetFilters = () => {
    setCptInput('');
    setTaxonomyInput('');
    setBillingClass('');
    setModifiers('');
    setNegotiatedType('Any');
    setSubmittedCodes([]);
    setCmsData(null);
    setPayerPriceData(null);
    setContractRates(null);
    setError(null);
  }

  const fetchDataForTab = async (tab: string, codes: string[]) => {
    if (codes.length === 0) return;
    setIsLoading(true);
    setError(null);

    try {
      const contractRatesPromise = fetchContractRatesAction(contract.id, codes);

      if (tab === 'cms-analysis') {
        const params = { 
            year: contract.year || '2025', 
            carrier_number: contract.carrier_number || '10212', 
            locality: contract.locality || '01', 
            hcpcs_codes: codes 
        };
        const cmsPromise = fetchChartDataAction(params);

        const [contractRes, cmsRes] = await Promise.all([contractRatesPromise, cmsPromise]);
        const rawContractData = contractRes.data;
        const cleanContractList = Array.isArray(rawContractData) ? rawContractData : rawContractData?.results || [];

        if (contractRes.error) throw new Error(contractRes.error);
        if (cmsRes.error) throw new Error(cmsRes.error);

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
          taxonomies: taxonomyInput ? [{ value: taxonomyInput, title: "", grouping: null }] : [{ value: "208D00000X", title: "", grouping: null }], 
          serviceCodes: [{ value: "11", title: "", grouping: null }],
          yearMonths: [{ value: { year: 2025, month: 6 }, title: "", grouping: null }],
          counties: null, billingCodeModifiers: null, billingClasses: null, entityTypes: null, includeIndirectNpis: false, negotiatedTypes: null,
        };

        const payerPromise = fetchPayerPriceAction(params);
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
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm space-y-6 transition-colors duration-200">
      
      {/* RATE ANALYSIS HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-gray-200 dark:border-gray-700 pb-4 gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Rate Analysis</h3>
          <p className="text-gray-500 dark:text-gray-400">Investigate contract reimbursement rates using payer market benchmarks and CPT filters.</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            type="button"
            onClick={resetFilters}
            disabled={isLoading}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md text-gray-700 dark:text-gray-200 font-medium transition-colors duration-200"
          >
            Reset Filters
          </button>
          <button 
            type="button"
            onClick={() => handleSubmit()}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-medium transition-colors duration-200 flex items-center justify-center min-w-[120px]"
          >
            {isLoading ? <Spinner /> : 'Run Analysis'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* FILTERS SECTION */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 space-y-6">
          
          {/* Error Message */}
          {error && <p className='text-sm font-medium text-destructive text-red-500'>{error}</p>}

          {/* Payer & Provider */}
          <div>
            <h4 className="text-blue-600 dark:text-blue-400 font-medium mb-3 flex items-center gap-2">Payer & Provider</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1 font-medium">Payer</label>
                <input 
                  type="text" 
                  value={payerInput}
                  onChange={(e) => setPayerInput(e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1 font-medium">Provider Taxonomy</label>
                <select 
                  value={taxonomyInput}
                  onChange={(e) => setTaxonomyInput(e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select or type...</option>
                  <option value="207Q00000X">e.g. 207Q00000X</option>
                  <option value="208D00000X">208D00000X</option>
                </select>
              </div>
            </div>
          </div>

          {/* Billing & Negotiation */}
          <div>
            <h4 className="text-blue-600 dark:text-blue-400 font-medium mb-3 flex items-center gap-2">Billing & Negotiation</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1 font-medium">
                  Billing Code (HCPCS/CPT) <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  value={cptInput}
                  onChange={(e) => setCptInput(e.target.value)}
                  placeholder="e.g. 99213, 99214" 
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1 font-medium">Billing Class</label>
                <input 
                  type="text" 
                  value={billingClass}
                  onChange={(e) => setBillingClass(e.target.value)}
                  placeholder="e.g. professional" 
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1 font-medium">Billing Code Modifiers</label>
                <input 
                  type="text" 
                  value={modifiers}
                  onChange={(e) => setModifiers(e.target.value)}
                  placeholder="Comma-separated, e.g. 25,59" 
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
            </div>
            <div className="w-full md:w-1/3 md:pr-2">
                <label className="block text-gray-700 dark:text-gray-300 mb-1 font-medium">Negotiated Type</label>
                <select 
                  value={negotiatedType}
                  onChange={(e) => setNegotiatedType(e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Any">Any</option>
                  <option value="Fee-for-service">Fee-for-service</option>
                  <option value="Percentage">Percentage</option>
                </select>
            </div>
          </div>
        </div>
      </form>

      {/* RESULTS SPLIT VIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Chart Container (Takes up 2/3) */}
        <div className="lg:col-span-2 border border-gray-200 dark:border-gray-700 rounded-xl p-6 flex flex-col min-h-[400px]">
          <div className="mb-6">
            <h4 className="font-semibold text-base text-gray-900 dark:text-white">Market Rate Comparison</h4>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Provider API rates grouped by billing code under active filters</p>
          </div>
          
          {submittedCodes.length === 0 && !isLoading ? (
            <div className="flex-grow flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm italic border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
              Enter CPT codes and run analysis to view charts
            </div>
          ) : (
            <Tabs
              value={activeTab}
              onValueChange={(newTab) => {
                setActiveTab(newTab);
                if (submittedCodes.length > 0) {
                    if (newTab === 'cms-analysis' && !cmsData) {
                        fetchDataForTab(newTab, submittedCodes);
                    } else if (newTab === 'payer-price-analysis' && !payerPriceData) {
                        fetchDataForTab(newTab, submittedCodes);
                    }
                }
              }}
              className="w-full flex-grow flex flex-col"
            >
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="cms-analysis">CMS vs Contract</TabsTrigger>
                <TabsTrigger value="payer-price-analysis">Payer Price vs Contract</TabsTrigger>
              </TabsList>

              <TabsContent value="cms-analysis" className='flex-grow relative'>
                {(isLoading && activeTab === 'cms-analysis') && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-gray-800/50 z-10"><Spinner /></div>
                )}
                {cmsData && (
                  <CMSDataChart
                    contractData={contract}
                    cmsData={cmsData}
                    submittedCodes={submittedCodes}
                    analysisData={contractRates} 
                  />
                )}
              </TabsContent>

              <TabsContent value="payer-price-analysis" className='flex-grow relative'>
                {(isLoading && activeTab === 'payer-price-analysis') && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-gray-800/50 z-10"><Spinner /></div>
                )}
                {payerPriceData && (
                  <PayerPriceDataChart
                    contractData={contract}
                    payerPriceData={payerPriceData}
                    submittedCodes={submittedCodes}
                    analysisData={contractRates}
                  />
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>

        {/* Right Sidebar Table Container (Takes up 1/3) */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <h4 className="font-semibold text-base mb-4 text-gray-900 dark:text-white">Market Rate Results</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 text-xs">
                  <th className="py-2 px-1 font-medium">CPT Code</th>
                  <th className="py-2 px-1 font-medium">Median Price</th>
                  <th className="py-2 px-1 font-medium">25th Percentile</th>
                  <th className="py-2 px-1 font-medium">50th Percentile</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-800 dark:text-gray-300">
                {/* Mapping logic placeholder: 
                  Since we don't have the exact API response shape for payerPriceData here,
                  this is rendering placeholders based on the codes submitted.
                  You will want to replace these hardcoded values with `item.median`, etc. from the API.
                */}
                {submittedCodes.length > 0 ? (
                  submittedCodes.map((code) => (
                    <tr key={code} className="border-b border-gray-100 dark:border-gray-700/50 last:border-0">
                      <td className="py-3 px-1">{code}</td>
                      <td className="py-3 px-1">-</td>
                      <td className="py-3 px-1">-</td>
                      <td className="py-3 px-1">-</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-gray-400 dark:text-gray-500 text-xs italic">
                      Awaiting Data
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}