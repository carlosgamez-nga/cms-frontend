export interface TaxonomyCode {
  code: string;
  name: string;
}

export const COMMON_TAXONOMIES: TaxonomyCode[] = [
  { code: '207Q00000X', name: 'Family Medicine' },
  { code: '207R00000X', name: 'Internal Medicine' },
  { code: '208D00000X', name: 'General Practice' },
  { code: '207V00000X', name: 'Obstetrics & Gynecology' },
  { code: '2084N0400X', name: 'Neurology' },
  { code: '207RC0000X', name: 'Cardiovascular Disease' },
  { code: '207RE0101X', name: 'Endocrinology' },
  { code: '207RG0100X', name: 'Gastroenterology' },
  { code: '207RX0202X', name: 'Medical Oncology' },
  { code: '2085R0202X', name: 'Diagnostic Radiology' },
  { code: '207L00000X', name: 'Anesthesiology' },
  { code: '207T00000X', name: 'Neurological Surgery' },
  { code: '208100000X', name: 'Physical Medicine & Rehabilitation' },
  { code: '208000000X', name: 'Pediatrics' },
  { code: '208600000X', name: 'Surgery' },
  { code: '208800000X', name: 'Urology' },
  { code: '207W00000X', name: 'Ophthalmology' },
  { code: '207Y00000X', name: 'Otolaryngology' },
  { code: '207N00000X', name: 'Dermatology' },
  { code: '207P00000X', name: 'Emergency Medicine' },
  { code: '2083P0901X', name: 'Public Health & General Preventive Medicine' },
  { code: '204D00000X', name: 'Neuromusculoskeletal Medicine & OMM' },
  { code: '207KA0200X', name: 'Allergy & Immunology' }
];
