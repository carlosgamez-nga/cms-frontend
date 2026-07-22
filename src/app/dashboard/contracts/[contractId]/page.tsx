import { notFound } from 'next/navigation';
import { getContract } from '@/features/contracts/queries/get-contracts.server';
import { getContractAnalysis } from '@/features/contracts/queries/get-contract-analysis.server';
import ContractChartsView from '@/features/contracts/components/ContractChartsView';
import DeleteContractButton from '@/features/contracts/components/DeleteContractButton';

interface ContractPageProps {
  params: Promise<{
    contractId: string;
  }>;
}

export default async function ContractPage({ params }: ContractPageProps) {
  const { contractId } = await params;
  const [contract, analysis] = await Promise.all([
    getContract(contractId),
    getContractAnalysis(contractId)
  ]);

  if (!contract) {
    notFound();
  }

  const avgVariance = analysis.length > 0 
    ? analysis.reduce((acc, curr) => acc + Number(curr.variance_percent || 0), 0) / analysis.length
    : 0;

  const totalImpact = analysis.reduce((acc, curr) => acc + Number(curr.variance_amount || 0), 0);

  return (
    <div className="space-y-6 mt-8 max-w-[1600px] mx-auto pb-12 text-sm text-gray-900 dark:text-gray-100">
      
      {/* 1. HEADER SECTION */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm transition-colors duration-200">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold mb-4">{contract.title}</h2>
            <div className="space-y-1 text-gray-700 dark:text-gray-300">
              <p><span className="font-medium text-gray-900 dark:text-white">Payer:</span> {contract.payer_name || 'N/A'}</p>
              <p><span className="font-medium text-gray-900 dark:text-white">Status:</span> {contract.status}</p>
              <p><span className="font-medium text-gray-900 dark:text-white">Effective:</span> {contract.effective_date || 'N/A'}</p>
              <p><span className="font-medium text-gray-900 dark:text-white">Expires:</span> {contract.expiration_date || 'N/A'}</p>
            </div>
          </div>
          <DeleteContractButton contractId={contractId} />
        </div>
      </div>

      {/* 2. SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm flex flex-col justify-between transition-colors duration-200">
          <p className="text-gray-500 dark:text-gray-400 mb-4">Total CPT Codes</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{analysis.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm flex flex-col justify-between transition-colors duration-200">
          <p className="text-gray-500 dark:text-gray-400 mb-4">Average Rate vs Market</p>
          <p className={`text-3xl font-bold ${avgVariance < 0 ? 'text-red-500' : 'text-green-500'}`}>
            {avgVariance.toFixed(1)}%
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm flex flex-col justify-between transition-colors duration-200">
          <p className="text-gray-500 dark:text-gray-400 mb-4">Total Variance Impact</p>
          <p className={`text-3xl font-bold ${totalImpact < 0 ? 'text-red-500' : 'text-green-500'}`}>
            ${Math.abs(totalImpact).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm flex flex-col justify-between transition-colors duration-200">
          <p className="text-gray-500 dark:text-gray-400 mb-4">Contract Duration</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {contract.effective_date && contract.expiration_date 
              ? `${Math.round((new Date(contract.expiration_date).getTime() - new Date(contract.effective_date).getTime()) / (1000 * 60 * 60 * 24 * 30))} months`
              : '--'
            }
          </p>
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
                <th className="py-3 px-2 font-medium">Contract Rate / Formula</th>
                <th className="py-3 px-2 font-medium">Impact ($)</th>
                <th className="py-3 px-2 font-medium text-right">Variance %</th>
              </tr>
            </thead>
            <tbody className="text-gray-800 dark:text-gray-300">
              {analysis.slice(0, 10).map((row, idx) => (
                <tr key={idx} className="border-b border-gray-100 dark:border-gray-700/50 last:border-0">
                  <td className="py-3 px-2">{row.cpt_code}</td>
                  <td className="py-3 px-2 truncate max-w-[200px]">{row.description || 'N/A'}</td>
                  <td className="py-3 px-2">${row.market_rate ? Number(row.market_rate).toFixed(2) : '--'}</td>
                  <td className="py-3 px-2 font-medium">
                    {row.rate_formula 
                      ? <span className="text-blue-600 dark:text-blue-400 italic">{row.rate_formula}</span>
                      : `$${Number(row.contract_rate).toFixed(2)}`
                    }
                  </td>
                  <td className={`py-3 px-2 ${row.variance_amount && Number(row.variance_amount) < 0 ? 'text-red-500' : 'text-green-500'}`}>
                    {row.variance_amount ? `$${Number(row.variance_amount).toFixed(2)}` : '--'}
                  </td>
                  <td className={`py-3 px-2 text-right font-medium ${row.variance_percent && Number(row.variance_percent) < 0 ? 'text-red-500' : 'text-green-500'}`}>
                    {row.variance_percent ? `${Number(row.variance_percent).toFixed(1)}%` : '--'}
                  </td>
                </tr>
              ))}
              {analysis.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500 italic">No rate data found for this contract.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. NEGOTIATION OPPORTUNITIES */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm transition-colors duration-200">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Negotiation Opportunities</h3>
        <div className="space-y-1 text-gray-700 dark:text-gray-300">
          <p className="font-medium text-gray-900 dark:text-gray-100">
            {analysis.filter(r => r.variance_percent && Number(r.variance_percent) < 0).length} CPT codes below market benchmarks
          </p>
          <p className="text-gray-500 dark:text-gray-400">
            Largest variance: {analysis.length > 0 ? `${Math.min(...analysis.map(r => Number(r.variance_percent) || 0)).toFixed(1)}%` : '--'}
          </p>
          <p className="text-gray-500 dark:text-gray-400">
            Estimated total variance: ${totalImpact.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* 5. RATE ANALYSIS (Interactive Client Component) */}
      <ContractChartsView contract={contract} />

    </div>
  );
}