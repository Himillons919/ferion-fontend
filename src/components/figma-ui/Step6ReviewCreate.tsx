import { StepReviewCreate } from './StepReviewCreate';
import { ProjectData } from './ProjectCreationWizard';
import { Project } from '@/types/project';

interface StepProps {
  data: ProjectData;
  onCreate: () => void;
}

export function Step6ReviewCreate({ data, onCreate }: StepProps) {
  const project: Project = {
    id: data.projectId ?? 'DRAFT',
    enterpriseId: 'DRAFT',
    name: data.projectName,
    status: 'DRAFT',
    assetType: data.assetType,
    description: data.description,
    acceptInstitutionalInvestors: data.acceptInstitutional,
    walletAddress: data.walletAddress,
    network: data.blockchainNetwork,
    assetLocation: data.assetLocation,
    assetDescription: data.assetDescription,
    assetValue: data.assetValue ? Number(data.assetValue) : null,
    tokenName: data.tokenName,
    tokenSymbol: data.tokenSymbol,
    totalSupply: data.totalSupply ? Number(data.totalSupply) : null,
    tokenDecimals: typeof data.decimals === 'number' ? data.decimals : Number(data.decimals) || null,
    initialPrice: data.initialTokenPrice ? Number(data.initialTokenPrice) : null,
    revenueMode: data.revenueMode,
    annualReturn: data.targetAnnualReturn ? Number(data.targetAnnualReturn) : null,
    payoutFrequency: data.distributionFrequency,
    capitalProfile: data.capitalProfile,
    distributionPolicy: data.distributionPolicy,
    distributionNotes: undefined,
    currentStep: 6,
  };

  return (
    <div className="space-y-4">
      <StepReviewCreate project={project} documents={[]} />
      <div className="flex justify-end">
        <button
          onClick={onCreate}
          className="inline-flex items-center rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-700"
        >
          Create Project
        </button>
      </div>
    </div>
  );
}

