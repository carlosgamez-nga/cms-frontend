export const PAYERPRICE_BILLING_CLASSES = [
  { value: 'professional', label: 'Professional' },
  { value: 'institutional', label: 'Institutional' }
];

export const PAYERPRICE_MODIFIERS = [
  { value: '26', label: '26 - Professional Component' },
  { value: 'TC', label: 'TC - Technical Component' },
  { value: '50', label: '50 - Bilateral Procedure' },
  { value: '51', label: '51 - Multiple Procedures' },
  { value: '52', label: '52 - Reduced Services' },
  { value: '53', label: '53 - Discontinued Procedure' },
  { value: '59', label: '59 - Distinct Procedural Service' },
  { value: '73', label: '73 - Discontinued Out-Pt Procedure Prior to Anesthesia Administration' },
  { value: '74', label: '74 - Discontinued Out-Pt Procedure After Anesthesia Administration' },
  { value: 'NU', label: 'NU - New Equipment' },
  { value: 'RR', label: 'RR - Rental' },
  { value: 'UE', label: 'UE - Used Durable Medical Equipment' },
];

const PAYER_STRINGS = [
  'BCBS', 'United', 'Aetna', 'Cigna', 'FirstHealth', 'BannerHealth', 'MeritainHealth',
  'Centene', 'Fidelis', 'Ambetter', 'QualChoice', 'HealthNet', 'ManagedHealthNetwork',
  'WellCare', 'DeanHealthPlan', 'Prevea360', 'TripleSSalud', 'AlliantHealthPlans',
  'AmeriHealth', 'AveraHealthPlans', 'BaylorScottWhiteHealthPlan', 'CareSource',
  'CommunityCareOklahoma', 'PriorityHealth', 'TuftsHealthPlan', 'MVPHealthCare',
  'HarvardPilgrimHealthCare', 'HealthAlliance', 'HealthAllianceHAP', 'HealthFirst',
  'HealthLink', 'HealthNewEngland', 'HealthPartners', 'HealthSmart', 'HometownHealth',
  'IndependentHealthAssociation', 'InterWestHealth', 'JohnsHopkinsHealthPlans',
  'KaiserPermanente', 'LyraHealth', 'LuminareHealth', 'MagnaCare', 'MassGeneralBrigham',
  'Medica', 'MedicalMutual', 'MidlandsChoice', 'ModaHealth', 'Molina', 'MultiPlan',
  'NeighborhoodHealthPlanOfRhodeIsland', 'OSUHealthPlan', 'OptimaHealth', 'Oscar',
  'PacificSource', 'PhysiciansHealthPlan', 'PresbyterianHealthPlan', 'ProvidenceHealthPlan',
  'Quartz', 'SanfordHealthPlan', 'SelectHealth', 'TexasChildrensHealthPlan', 'TheAlliance',
  'TrilogyHealthSolutions', 'UCare', 'UHAHealthInsurance', 'UPMCHealthPlan'
];

export const PAYERPRICE_PAYERS = PAYER_STRINGS.map(payer => ({
  value: payer,
  label: payer.replace(/([a-z])([A-Z])/g, '$1 $2')
}));
