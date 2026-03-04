'use client';

import { useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ChevronDown } from 'lucide-react';
import { PiBuildings, PiStethoscope } from 'react-icons/pi';
import { TAXONOMY_CODES } from '../constants/taxonomy-codes';
import { PayerPriceFilterValues } from '../types';

interface PayerPriceFiltersProps {
  filters: PayerPriceFilterValues;
  onChange: (key: keyof PayerPriceFilterValues, value: string) => void;
}

const PayerPriceFilters = ({ filters, onChange }: PayerPriceFiltersProps) => {
  const [isTaxonomyMenuOpen, setIsTaxonomyMenuOpen] = useState(false);
  const [isNegotiatedMenuOpen, setIsNegotiatedMenuOpen] = useState(false);

  const filteredTaxonomyCodes = useMemo(() => {
    const query = filters.provider_taxonomy.trim().toLowerCase();
    if (!query) return TAXONOMY_CODES;

    return TAXONOMY_CODES.filter((code) => code.toLowerCase().includes(query));
  }, [filters.provider_taxonomy]);

  const negotiatedTypeOptions = [
    { label: 'Any', value: '' },
    { label: 'Negotiated', value: 'negotiated' },
    { label: 'Derived', value: 'derived' },
    { label: 'Fee Schedule', value: 'fee schedule' },
    { label: 'Percentage', value: 'percentage' },
    { label: 'Per Diem', value: 'per diem' },
  ];

  const selectedNegotiatedTypeLabel =
    negotiatedTypeOptions.find((option) => option.value === filters.negotiated_type)
      ?.label || 'Any';

  return (
    <div className='flex flex-col gap-6 p-6 mb-4 border rounded-lg bg-card text-card-foreground shadow-sm'>
      <div className='space-y-4'>
        <div className='flex items-center gap-2 text-lg font-semibold text-primary/80 mt-2'>
          <PiBuildings className='w-5 h-5' />
          <h3>Payer & Provider</h3>
        </div>
        <Separator />
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          <div className='space-y-2'>
            <Label htmlFor='payer'>Payer</Label>
            <Input
              id='payer'
              placeholder='e.g. Blue Cross Blue Shield'
              value={filters.payer}
              onChange={(e) => onChange('payer', e.target.value)}
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='provider_taxonomy'>Provider Taxonomy</Label>
            <div className='relative'>
              <Input
                id='provider_taxonomy'
                className='pr-8'
                placeholder='e.g. 207Q00000X'
                value={filters.provider_taxonomy}
                onFocus={() => setIsTaxonomyMenuOpen(true)}
                onBlur={() => {
                  setTimeout(() => {
                    setIsTaxonomyMenuOpen(false);
                  }, 120);
                }}
                onChange={(e) => {
                  onChange('provider_taxonomy', e.target.value);
                  setIsTaxonomyMenuOpen(true);
                }}
              />
              <ChevronDown className='pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
              {isTaxonomyMenuOpen && filteredTaxonomyCodes.length > 0 && (
                <div className='absolute z-20 mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow-md'>
                  <ul className='max-h-56 overflow-y-auto py-1'>
                    {filteredTaxonomyCodes.map((code) => (
                      <li key={code}>
                        <button
                          type='button'
                          className='w-full px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground'
                          onMouseDown={() => {
                            onChange('provider_taxonomy', code);
                            setIsTaxonomyMenuOpen(false);
                          }}
                        >
                          {code}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className='space-y-4'>
        <div className='flex items-center gap-2 text-lg font-semibold text-primary/80 mt-2'>
          <PiStethoscope className='w-5 h-5' />
          <h3>Billing & Negotiation</h3>
        </div>
        <Separator />
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          <div className='space-y-2'>
            <Label htmlFor='billing_code'>Billing Code (HCPCS/CPT)</Label>
            <Input
              id='billing_code'
              placeholder='e.g. 99213 or A0428'
              value={filters.billing_code}
              onChange={(e) => onChange('billing_code', e.target.value)}
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='billing_class'>Billing Class</Label>
            <Input
              id='billing_class'
              placeholder='e.g. professional'
              value={filters.billing_class}
              onChange={(e) => onChange('billing_class', e.target.value)}
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='billing_code_modifiers'>Billing Code Modifiers</Label>
            <Input
              id='billing_code_modifiers'
              placeholder='Comma-separated, e.g. 25,59'
              value={filters.billing_code_modifiers}
              onChange={(e) => onChange('billing_code_modifiers', e.target.value)}
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='negotiated_type'>Negotiated Type</Label>
            <div className='relative'>
              <Input
                id='negotiated_type'
                className='pr-8'
                value={selectedNegotiatedTypeLabel}
                readOnly
                onFocus={() => setIsNegotiatedMenuOpen(true)}
                onClick={() => setIsNegotiatedMenuOpen((prev) => !prev)}
                onBlur={() => {
                  setTimeout(() => {
                    setIsNegotiatedMenuOpen(false);
                  }, 120);
                }}
              />
              <ChevronDown className='pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
              {isNegotiatedMenuOpen && (
                <div className='absolute z-20 mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow-md'>
                  <ul className='max-h-56 overflow-y-auto py-1'>
                    {negotiatedTypeOptions.map((option) => (
                      <li key={option.value || 'any'}>
                        <button
                          type='button'
                          className='w-full px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground'
                          onMouseDown={() => {
                            onChange('negotiated_type', option.value);
                            setIsNegotiatedMenuOpen(false);
                          }}
                        >
                          {option.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayerPriceFilters;
