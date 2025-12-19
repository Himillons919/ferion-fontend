import { StepRevenueModel } from './StepRevenueModel';
import { ProjectData } from './ProjectCreationWizard';
import { RevenueModelInput } from '@/lib/validators';

interface StepProps {
  data: ProjectData;
  onUpdate: (updates: Partial<ProjectData>) => void;
}

const revenueModeOptions = [
  { value: 'fixed', label: 'Fixed' },
  { value: 'variable', label: 'Variable' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'other', label: 'Other' },
];

const capitalProfileOptions = [
  { value: 'bullet', label: 'Bullet' },
  { value: 'amortizing', label: 'Amortizing' },
  { value: 'perpetual', label: 'Perpetual' },
];

const distributionPolicyOptions = [
  { value: 'cash', label: 'Cash Distribution' },
  { value: 'reinvest', label: 'Automatic Reinvestment' },
  { value: 'choice', label: 'Investor Choice' },
];

const distributionFrequencyOptions = [
  { value: 'Monthly', label: 'Monthly' },
  { value: 'Quarterly', label: 'Quarterly' },
  { value: 'Semi-annual', label: 'Semi-annual' },
  { value: 'Annual', label: 'Annual' },
];

export function Step5RevenueModel({ data, onUpdate }: StepProps) {
  const values: RevenueModelInput = {
    revenueMode: data.revenueMode,
    capitalProfile: data.capitalProfile,
    distributionPolicy: data.distributionPolicy,
    payoutFrequency: data.distributionFrequency,
    annualReturn: data.targetAnnualReturn ? Number(data.targetAnnualReturn) : 0,
    distributionNotes: undefined,
  };

  const handleChange = <K extends keyof RevenueModelInput>(
    key: K,
    value: RevenueModelInput[K] | undefined
  ) => {
    const mapped: Partial<ProjectData> = {};
    if (key === 'revenueMode') mapped.revenueMode = value as string;
    if (key === 'capitalProfile') mapped.capitalProfile = value as string;
    if (key === 'distributionPolicy') mapped.distributionPolicy = value as string;
    if (key === 'payoutFrequency') mapped.distributionFrequency = value as string;
    if (key === 'annualReturn') {
      mapped.targetAnnualReturn = value === undefined || value === null ? '' : String(value);
    }
    onUpdate(mapped);
  };

  const projectPreview = {
    assetType: data.assetType,
    tokenSymbol: data.tokenSymbol,
    totalSupply: data.totalSupply ? Number(data.totalSupply) : null,
  };

  return (
    <StepRevenueModel
      values={values}
      errors={{}}
      revenueModes={revenueModeOptions}
      capitalProfiles={capitalProfileOptions}
      distributionPolicies={distributionPolicyOptions}
      distributionFrequencies={distributionFrequencyOptions}
      projectPreview={projectPreview}
      onChange={handleChange}
    />
  );
}
