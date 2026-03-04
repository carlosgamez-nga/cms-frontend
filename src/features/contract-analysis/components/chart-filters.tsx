'use client';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ContractAnalysisFilterValues } from '../types';

import { US_STATES } from '@/lib/constants';
import { PiMapPin, PiStethoscope, PiBuildings } from 'react-icons/pi';
import { Separator } from '@/components/ui/separator';

interface ChartFiltersProps {
  filters: ContractAnalysisFilterValues;
  onChange: (key: keyof ContractAnalysisFilterValues, value: string) => void;
}

const ChartFilters = ({ filters, onChange }: ChartFiltersProps) => {
  return (
    <div className='flex flex-col gap-6 p-6 mb-4 border rounded-lg bg-card text-card-foreground shadow-sm'>
      {/* Location & Time */}
      <div className='space-y-4'>
        <div className='flex items-center gap-2 text-lg font-semibold text-primary/80 mt-8'>
          <PiMapPin className='w-5 h-5' />
          <h3>Location & Time</h3>
        </div>
        <Separator />
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
          <div className='space-y-2'>
            <Label htmlFor='state'>State</Label>
            <Select
              value={filters.state}
              onValueChange={(value) => onChange('state', value)}
            >
              <SelectTrigger className='w-full' id='state'>
                <SelectValue placeholder='Select state' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All</SelectItem>
                {US_STATES.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='county'>County</Label>
            <Input
              id='county'
              placeholder='County'
              value={filters.county}
              onChange={(e) => onChange('county', e.target.value)}
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='year'>Year</Label>
            <Input
              id='year'
              placeholder='Year'
              value={filters.year}
              onChange={(e) => onChange('year', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Service Details */}
      <div className='space-y-4'>
        <div className='flex items-center gap-2 text-lg font-semibold text-primary/80 mt-8'>
          <PiStethoscope className='w-5 h-5' />
          <h3>Service Details</h3>
        </div>
        <Separator />
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
          <div className='space-y-2'>
            <Label htmlFor='service_code'>Service Code</Label>
            <Input
              id='service_code'
              placeholder='Service Code'
              value={filters.service_code}
              onChange={(e) => onChange('service_code', e.target.value)}
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='modifier'>Modifier</Label>
            <Input
              id='modifier'
              placeholder='Modifier'
              value={filters.modifier}
              onChange={(e) => onChange('modifier', e.target.value)}
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='facility_type'>Facility Type</Label>
            <Select
              value={filters.facility_type}
              onValueChange={(value) => onChange('facility_type', value)}
            >
              <SelectTrigger className='w-full' id='facility_type'>
                <SelectValue placeholder='Select facility type' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All</SelectItem>
                <SelectItem value='facility'>Facility</SelectItem>
                <SelectItem value='non-facility'>Non-Facility</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Payer & Provider */}
      <div className='space-y-4'>
        <div className='flex items-center gap-2 text-lg font-semibold text-primary/80 mt-8'>
          <PiBuildings className='w-5 h-5' />
          <h3>Payer & Provider</h3>
        </div>
        <Separator />
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
          <div className='space-y-2'>
            <Label htmlFor='payer'>Insurance Payer</Label>
            <Input
              id='payer'
              placeholder='Payer'
              value={filters.payer}
              onChange={(e) => onChange('payer', e.target.value)}
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='taxonomy'>Taxonomy</Label>
            <Input
              id='taxonomy'
              placeholder='Taxonomy'
              value={filters.taxonomy}
              onChange={(e) => onChange('taxonomy', e.target.value)}
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='entity_type'>Entity Type</Label>
            <Select
              value={filters.entity_type}
              onValueChange={(value) => onChange('entity_type', value)}
            >
              <SelectTrigger className='w-full' id='entity_type'>
                <SelectValue placeholder='Select entity type' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All</SelectItem>
                <SelectItem value='individual'>Individual</SelectItem>
                <SelectItem value='group'>Group</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='negotiated_type'>Negotiated Type</Label>
            <Select
              value={filters.negotiated_type}
              onValueChange={(value) => onChange('negotiated_type', value)}
            >
              <SelectTrigger className='w-full' id='negotiated_type'>
                <SelectValue placeholder='Select type' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All</SelectItem>
                <SelectItem value='negotiated'>Negotiated</SelectItem>
                <SelectItem value='derived'>Derived</SelectItem>
                <SelectItem value='fee schedule'>Fee Schedule</SelectItem>
                <SelectItem value='percentage'>Percentage</SelectItem>
                <SelectItem value='per diem'>Per Diem</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartFilters;
