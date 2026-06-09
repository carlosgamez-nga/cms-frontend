import { notFound } from 'next/navigation';
import { getContract } from '@/features/contracts/queries/get-contracts.server';
import ContractChartsView from '@/features/contracts/components/ContractChartsView';

interface ContractPageProps {
  params: Promise<{
    contractId: string;
  }>;
}

export default async function ContractPage({ params }: ContractPageProps) {
  const { contractId } = await params;
  const contract = await getContract(contractId);

  if (!contract) {
    notFound();
  }

  return (
    <div className="space-y-6 mt-8 max-w-[1600px] mx-auto pb-12 text-sm text-gray-900 dark:text-gray-100">
      
      {/* 1. HEADER SECTION */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm transition-colors duration-200">
        <h2 className="text-2xl font-bold mb-4">{contract.title}</h2>
        <div className="space-y-1 text-gray-700 dark:text-gray-300">
          <p><span className="font-medium text-gray-900 dark:text-white">Payer:</span> {contract.payer_name || 'UHC'}</p>
          <p><span className="font-medium text-gray-900 dark:text-white">Status:</span> Active</p>
          <p><span className="font-medium text-gray-900 dark:text-white">Effective:</span> Jun 25, 2025</p>
          <p><span className="font-medium text-gray-900 dark:text-white">Expires:</span> May 19, 2026</p>
        </div>
      </div>

      {/* 2. SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm flex flex-col justify-between transition-colors duration-200">
          <p className="text-gray-500 dark:text-gray-400 mb-4">Total CPT Codes</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">47</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm flex flex-col justify-between transition-colors duration-200">
          <p className="text-gray-500 dark:text-gray-400 mb-4">Average Rate vs Market</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">-7%</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm flex flex-col justify-between transition-colors duration-200">
          <p className="text-gray-500 dark:text-gray-400 mb-4">Contract Variance Avg</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">$39.60</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm flex flex-col justify-between transition-colors duration-200">
          <p className="text-gray-500 dark:text-gray-400 mb-4">Contract Duration</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">11 months</p>
        </div>
      </div>

      {/* 3. CPT RATE COMPARISON TABLE */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm transition-colors duration-200">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">CPT Rate Comparison</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400">
                <th className="py-3 px-2 font-medium">CPT Code</th>
                <th className="py-3 px-2 font-medium">Description</th>
                <th className="py-3 px-2 font-medium">Market Rate</th>
                <th className="py-3 px-2 font-medium">Contract Rate</th>
                <th className="py-3 px-2 font-medium">Impact ($)</th>
                <th className="py-3 px-2 font-medium text-right">Variance %</th>
              </tr>
            </thead>
            <tbody className="text-gray-800 dark:text-gray-300">
              <tr className="border-b border-gray-100 dark:border-gray-700/50">
                <td className="py-3 px-2">80053</td>
                <td className="py-3 px-2">Comprehensive Metabolic Panel</td>
                <td className="py-3 px-2">$86.00</td>
                <td className="py-3 px-2">$79.00</td>
                <td className="py-3 px-2">$7.00</td>
                <td className="py-3 px-2 text-right text-red-500 dark:text-red-400">-8%</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-700/50">
                <td className="py-3 px-2">74177</td>
                <td className="py-3 px-2">CT Abdomen and Pelvis</td>
                <td className="py-3 px-2">$980.00</td>
                <td className="py-3 px-2">$915.00</td>
                <td className="py-3 px-2">$65.00</td>
                <td className="py-3 px-2 text-right text-red-500 dark:text-red-400">-7%</td>
              </tr>
              <tr>
                <td className="py-3 px-2">99213</td>
                <td className="py-3 px-2">Office Visit</td>
                <td className="py-3 px-2">$95.00</td>
                <td className="py-3 px-2">$89.00</td>
                <td className="py-3 px-2">$6.00</td>
                <td className="py-3 px-2 text-right text-red-500 dark:text-red-400">-6%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. NEGOTIATION OPPORTUNITIES */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm transition-colors duration-200">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Negotiation Opportunities</h3>
        <div className="space-y-1 text-gray-700 dark:text-gray-300">
          <p className="font-medium text-gray-900 dark:text-gray-100">5 CPT codes below market benchmarks</p>
          <p className="text-gray-500 dark:text-gray-400">Largest variance: -8% (CPT 80053)</p>
          <p className="text-gray-500 dark:text-gray-400">Estimated annual improvement: $24K annually</p>
        </div>
      </div>

      {/* 5. RATE ANALYSIS (Interactive Client Component) */}
      <ContractChartsView contract={contract} />

    </div>
  );
}