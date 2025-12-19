import { StepTokenSettings } from './StepTokenSettings';
import { ProjectData } from './ProjectCreationWizard';
import { TokenSettingsInput } from '@/lib/validators';

interface StepProps {
  data: ProjectData;
  onUpdate: (updates: Partial<ProjectData>) => void;
}

export function Step4TokenSettings({ data, onUpdate }: StepProps) {
  const values: TokenSettingsInput = {
    tokenName: data.tokenName,
    tokenSymbol: data.tokenSymbol,
    totalSupply: data.totalSupply ? Number(data.totalSupply) : 0,
    tokenDecimals:
      typeof data.decimals === 'number'
        ? data.decimals
        : Number(data.decimals) || 18,
    initialPrice: data.initialTokenPrice ? Number(data.initialTokenPrice) : 0,
  };

  const handleChange = <K extends keyof TokenSettingsInput>(
    key: K,
    value: TokenSettingsInput[K] | undefined
  ) => {
    const mapped: Partial<ProjectData> = {};
    if (key === 'tokenName') mapped.tokenName = value as string;
    if (key === 'tokenSymbol') mapped.tokenSymbol = value as string;
    if (key === 'totalSupply') {
      mapped.totalSupply = value === undefined || value === null ? '' : String(value);
    }
    if (key === 'tokenDecimals') {
      mapped.decimals = value as number;
    }
    if (key === 'initialPrice') {
      mapped.initialTokenPrice = value === undefined || value === null ? '' : String(value);
    }
    onUpdate(mapped);
  };

  const assetValue = data.assetValue ? Number(data.assetValue) : null;

  return (
    <StepTokenSettings
      values={values}
      errors={{}}
      assetValue={assetValue}
      onChange={handleChange}
    />
  );
}
