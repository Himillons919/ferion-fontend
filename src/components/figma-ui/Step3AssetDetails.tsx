import { StepAssetDetails } from './StepAssetDetails';
import { ProjectData } from './ProjectCreationWizard';
import { AssetDetailsInput } from '@/lib/validators';

interface StepProps {
  data: ProjectData;
  onUpdate: (updates: Partial<ProjectData>) => void;
}

export function Step3AssetDetails({ data, onUpdate }: StepProps) {
  const values: AssetDetailsInput = {
    assetLocation: data.assetLocation,
    assetDescription: data.assetDescription,
    assetValue: data.assetValue ? Number(data.assetValue) : 0,
  };

  const handleChange = <K extends keyof AssetDetailsInput>(
    key: K,
    value: AssetDetailsInput[K]
  ) => {
    const mapped: Partial<ProjectData> = {};
    if (key === 'assetLocation') mapped.assetLocation = value as string;
    if (key === 'assetDescription') mapped.assetDescription = value as string;
    if (key === 'assetValue') {
      mapped.assetValue = value === undefined || value === null ? '' : String(value);
    }
    onUpdate(mapped);
  };

  return (
    <StepAssetDetails
      values={values}
      errors={{}}
      documents={[]}
      onChange={handleChange}
      onUpload={() => {}}
    />
  );
}
