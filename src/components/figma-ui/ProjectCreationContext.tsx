import { createContext, useContext, useState, ReactNode } from 'react';

export interface ProjectData {
  // Step 1: Project Basics
  projectName: string;
  assetType: string;
  description: string;
  acceptInstitutional: boolean;
  
  // Step 2: Blockchain Settings
  walletAddress: string;
  blockchainNetwork: string;
  
  // Step 3: Asset Details
  assetLocation: string;
  assetDescription: string;
  assetValue: string;
  assetCurrency: string;
  documents: File[];
  
  // Step 4: Token Settings
  tokenName: string;
  tokenSymbol: string;
  totalSupply: string;
  decimals: string;
  initialTokenPrice: string;
  
  // Step 5: Revenue Model
  revenueMode: string;
  capitalProfile: string;
  targetReturn: string;
  distributionPolicy: string;
  distributionFrequency: string;
  
  // Metadata
  projectId?: string;
  status: 'Draft' | 'Created';
  createdAt?: Date;
}

interface ProjectCreationContextType {
  projectData: ProjectData;
  updateProjectData: (data: Partial<ProjectData>) => void;
  resetProjectData: () => void;
}

const defaultProjectData: ProjectData = {
  projectName: '',
  assetType: '',
  description: '',
  acceptInstitutional: false,
  walletAddress: '',
  blockchainNetwork: '',
  assetLocation: '',
  assetDescription: '',
  assetValue: '',
  assetCurrency: 'USD',
  documents: [],
  tokenName: '',
  tokenSymbol: '',
  totalSupply: '',
  decimals: '18',
  initialTokenPrice: '',
  revenueMode: '',
  capitalProfile: '',
  targetReturn: '',
  distributionPolicy: '',
  distributionFrequency: '',
  status: 'Draft',
};

const ProjectCreationContext = createContext<ProjectCreationContextType | undefined>(undefined);

export function ProjectCreationProvider({ children }: { children: ReactNode }) {
  const [projectData, setProjectData] = useState<ProjectData>(defaultProjectData);

  const updateProjectData = (data: Partial<ProjectData>) => {
    setProjectData(prev => ({ ...prev, ...data }));
  };

  const resetProjectData = () => {
    setProjectData(defaultProjectData);
  };

  return (
    <ProjectCreationContext.Provider value={{ projectData, updateProjectData, resetProjectData }}>
      {children}
    </ProjectCreationContext.Provider>
  );
}

export function useProjectCreation() {
  const context = useContext(ProjectCreationContext);
  if (!context) {
    throw new Error('useProjectCreation must be used within ProjectCreationProvider');
  }
  return context;
}
