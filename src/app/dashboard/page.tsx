// app/dashboard/page.tsx

import { getContractsOnServer } from '@/features/contracts/queries/get-contracts.server';
import { getUserDetailsOnServer } from '@/features/auth/queries/get-user.server';

import Banner from './components/banner';
import ContractUpload from '@/features/contracts/components/contract-upload';
import RecentContracts from './components/recent-contracts/recent-contracts';
import ContractsRevenue from './components/contracts-revenue/contracts-revenue';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const [user, contracts] = await Promise.all([
    getUserDetailsOnServer(), 
    getContractsOnServer(),   
  ]);
  
  const username = user?.username || 'Guest';
  const displayUsername = username.charAt(0).toUpperCase() + username.slice(1);

  return (
    <div className="max-w-[1600px] mx-auto mt-8 pb-12 text-sm text-gray-900 dark:text-gray-100">
      {contracts.length < 1 ? (
        <>
          <Banner users_name={displayUsername} />
          <ContractUpload title='Upload a contract to get started' />
        </>
      ) : (
        <div className="space-y-8">
          
          {/* HEADER */}
          <div>
            <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Contract Overview</h1>
          </div>

          {/* 1. TOP SUMMARY CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm flex flex-col justify-between transition-colors duration-200">
              <p className="text-gray-500 dark:text-gray-400 mb-4 font-medium">Active Contracts</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{contracts.length}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm flex flex-col justify-between transition-colors duration-200">
              <p className="text-gray-500 dark:text-gray-400 mb-4 font-medium">Total CPT Codes</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">265</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm flex flex-col justify-between transition-colors duration-200">
              <p className="text-gray-500 dark:text-gray-400 mb-4 font-medium">Avg Rate vs Market (%)</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">-4%</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm flex flex-col justify-between transition-colors duration-200">
              <p className="text-gray-500 dark:text-gray-400 mb-4 font-medium">Contracts Expiring in 90 Days</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">3</p>
            </div>
          </div>

          {/* 2. CONTRACT HEALTH SECTION */}
          <div>
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Contract Health</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Health Card 1 */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm flex flex-row items-center justify-between transition-colors duration-200">
                <div>
                  <p className="text-gray-500 dark:text-gray-400 mb-2 font-medium">Contracts Below Market (&gt;5%)</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">2</p>
                </div>
                <span className="px-2 py-1 text-xs font-medium rounded bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                  High Risk
                </span>
              </div>
              
              {/* Health Card 2 */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm flex flex-row items-center justify-between transition-colors duration-200">
                <div>
                  <p className="text-gray-500 dark:text-gray-400 mb-2 font-medium">Contracts Expiring in 90 Days</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">3</p>
                </div>
                <span className="px-2 py-1 text-xs font-medium rounded bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                  Attention Needed
                </span>
              </div>

              {/* Health Card 3 */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm flex flex-row items-center justify-between transition-colors duration-200">
                <div>
                  <p className="text-gray-500 dark:text-gray-400 mb-2 font-medium">Pending Negotiations</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">1</p>
                </div>
                <span className="px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                  In Progress
                </span>
              </div>
            </div>
          </div>

          {/* 3. CHARTS & SUMMARY SECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Using your existing ContractsRevenue component here */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm transition-colors duration-200 flex flex-col">
              <h3 className="font-semibold text-base text-gray-900 dark:text-white mb-1">Contract Revenue</h3>
              <p className="text-gray-500 dark:text-gray-400 text-xs mb-6">Overview of revenue metrics</p>
              <div className="flex-grow w-full min-h-[250px]">
                <ContractsRevenue />
              </div>
            </div>

            {/* Donut Chart Placeholder */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm transition-colors duration-200 flex flex-col">
              <h3 className="font-semibold text-base text-gray-900 dark:text-white mb-1">Payer Distribution</h3>
              <p className="text-gray-500 dark:text-gray-400 text-xs mb-6">Contract revenue by payer</p>
              <div className="flex-grow flex items-center justify-center border-2 border-dashed border-gray-100 dark:border-gray-700 rounded-lg min-h-[250px]">
                <p className="text-gray-400 dark:text-gray-500 italic text-sm">[Donut Chart Placeholder Component]</p>
              </div>
            </div>

            {/* Top 5 Contracts Summary Table */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm transition-colors duration-200">
              <h3 className="font-semibold text-base text-gray-900 dark:text-white mb-1">Contracts Summary</h3>
              <p className="text-gray-500 dark:text-gray-400 text-xs mb-4">Top 5 contracts</p>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 text-xs">
                      <th className="py-2 px-1 font-medium">Contract</th>
                      <th className="py-2 px-1 font-medium">Payer</th>
                      <th className="py-2 px-1 font-medium text-right">CPT Codes</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm text-gray-800 dark:text-gray-300">
                    {contracts.slice(0, 5).map((contract) => (
                      <tr key={contract.id} className="border-b border-gray-100 dark:border-gray-700/50 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                        <td className="py-3 px-1 font-medium truncate max-w-[150px]">{contract.title}</td>
                        <td className="py-3 px-1">{contract.payer_name || 'Unknown'}</td>
                        <td className="py-3 px-1 text-right text-gray-500 dark:text-gray-400">--</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* 4. ALL CONTRACTS TABLE SECTION */}
          <div className="pt-4">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">All Contracts</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Review, search, and manage all your stored contracts.</p>
            </div>
            
            {/* Mounting your existing RecentContracts component, passing down the fetched data */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm transition-colors duration-200">
              <RecentContracts contracts={contracts} />
            </div>
          </div>

        </div>
      )}
    </div>
  );
}