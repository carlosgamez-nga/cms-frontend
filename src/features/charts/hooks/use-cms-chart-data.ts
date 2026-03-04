'use client';

import { useState, useEffect } from 'react';
import { ContractAnalysisFilterValues } from '@/features/contract-analysis/types';
import { getCMSData } from '../queries/get-cms-data';
import { getCurrentContractData } from '../queries/get-current-contract-data';
import { ChartDatum } from '../types';

interface UseCMSChartDataProps {
    initialState?: string;
    initialYear?: string;
}

export const useCMSChartData = ({
    initialState,
    initialYear,
}: UseCMSChartDataProps) => {
    const [chartData, setChartData] = useState<ChartDatum[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState<ContractAnalysisFilterValues>({
        state: initialState || '',
        county: '',
        facility_type: 'all',
        year: initialYear || '',
        modifier: '',
        payer: '',
        taxonomy: '',
        entity_type: 'all',
        negotiated_type: 'all',
        service_code: '',
    });

    useEffect(() => {
        if (initialState || initialYear) {
            setFilters((prev) => ({
                ...prev,
                state: initialState || prev.state,
                year: initialYear || prev.year,
            }));
        }
    }, [initialState, initialYear]);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const cms = await getCMSData(filters);
                const current = await getCurrentContractData();

                const currentMap = Object.fromEntries(
                    current.cpt_prices.map(({ cpt_code, price }) => [cpt_code, price])
                );

                const cmsMap = Object.fromEntries(
                    cms.cpt_prices.map(({ cpt_code, price }) => [cpt_code, price])
                );

                const merged = Object.keys(cmsMap).map((code) => {
                    const cmsPrice = cmsMap[code];
                    const currentPrice = currentMap[code] || 0;

                    return {
                        code,
                        current_contract: currentPrice,
                        cms: cmsPrice,
                        currentContractFill:
                            currentPrice > cmsPrice
                                ? '#16a34a'
                                : currentPrice < cmsPrice
                                    ? '#dc2626'
                                    : '#8EC6FF',
                    };
                });

                setChartData(merged);
            } catch (error) {
                console.error('Failed to load chart data', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [filters]);

    const handleFilterChange = (
        key: keyof ContractAnalysisFilterValues,
        value: string
    ) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    return {
        chartData,
        filters,
        setFilters,
        handleFilterChange,
        isLoading,
    };
};
