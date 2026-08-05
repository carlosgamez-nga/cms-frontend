'use client';

import React, { useState, useMemo } from 'react';
import { ContractAnalysisRow } from '@/features/contracts/queries/get-contract-analysis.server';

interface ContractRateTableProps {
  analysis: ContractAnalysisRow[];
}

export default function ContractRateTable({ analysis }: ContractRateTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Sort analysis so that items with market_rate !== null come first
  const sortedAnalysis = useMemo(() => {
    return [...analysis].sort((a, b) => {
      const aHasData = a.market_rate !== null;
      const bHasData = b.market_rate !== null;
      if (aHasData && !bHasData) return -1;
      if (!aHasData && bHasData) return 1;
      return 0;
    });
  }, [analysis]);

  const totalPages = Math.ceil(sortedAnalysis.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = sortedAnalysis.slice(startIndex, startIndex + itemsPerPage);

  const handlePrev = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  return (
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
            {paginatedData.map((row, idx) => (
              <tr key={idx} className="border-b border-gray-100 dark:border-gray-700/50 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
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
      
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedAnalysis.length)} of {sortedAnalysis.length} entries
          </p>
          <div className="flex gap-2">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm rounded border border-gray-300 dark:border-gray-600 disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm rounded border border-gray-300 dark:border-gray-600 disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
