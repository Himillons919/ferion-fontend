import { useState, useEffect } from 'react';
import { ProgressIndicator } from './ProgressIndicator';
import { Step1ProjectBasics } from './Step1ProjectBasics';
import { Step2BlockchainSettings } from './Step2BlockchainSettings';
import { Step3AssetDetails } from './Step3AssetDetails';
import { Step4TokenSettings } from './Step4TokenSettings';
import { Step5RevenueModel } from './Step5RevenueModel';
import { Step6ReviewCreate } from './Step6ReviewCreate';
import { ChevronLeft, ChevronRight, Save } from 'lucide-react';

export interface ProjectData {
  projectId?: string;
  status: 'draft' | 'created';
  // Step 1
  projectName: string;
  assetType: string;
  description: string;
  acceptInstitutional: boolean;
  // Step 2
  walletAddress: string;
  blockchainNetwork: string;
  // Step 3
  assetLocation: string;
  assetDescription: string;
  assetValue: string;
  assetCurrency: string;
  documents: File[];
  // Step 4
  tokenName: string;
  tokenSymbol: string;
  totalSupply: string;
  decimals: number;
  initialTokenPrice: string;
  // Step 5
  revenueMode: string;
  capitalProfile: string;
  targetAnnualReturn: string;
  distributionPolicy: string;
  distributionFrequency: string;
}

const TOTAL_STEPS = 6;

export function ProjectCreationWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [projectData, setProjectData] = useState<ProjectData>({
    status: 'draft',
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
    decimals: 18,
    initialTokenPrice: '',
    revenueMode: '',
    capitalProfile: '',
    targetAnnualReturn: '',
    distributionPolicy: '',
    distributionFrequency: '',
  });

  // Load draft from localStorage on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem('ferion_project_draft');
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        setProjectData(parsed.data);
        setCurrentStep(parsed.step);
      } catch (e) {
        console.error('Failed to load draft', e);
      }
    }
  }, []);

  // Save draft to localStorage
  const saveDraft = () => {
    const draft = {
      data: projectData,
      step: currentStep,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem('ferion_project_draft', JSON.stringify(draft));
  };

  const updateProjectData = (updates: Partial<ProjectData>) => {
    setProjectData((prev) => ({ ...prev, ...updates }));
  };

  const handleNext = () => {
    // Generate project ID on first next click
    if (currentStep === 1 && !projectData.projectId) {
      updateProjectData({ 
        projectId: `PROJ-${Date.now()}`,
        status: 'draft' 
      });
    }
    
    saveDraft();
    
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSaveDraft = () => {
    saveDraft();
    // Show toast notification (simplified)
    alert('Draft saved successfully!');
  };

  const handleCreateProject = () => {
    updateProjectData({ status: 'created' });
    saveDraft();
    // In real app, would navigate to Project Overview
    alert('Project created successfully! Redirecting to Project Overview...');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1ProjectBasics data={projectData} onUpdate={updateProjectData} />;
      case 2:
        return <Step2BlockchainSettings data={projectData} onUpdate={updateProjectData} />;
      case 3:
        return <Step3AssetDetails data={projectData} onUpdate={updateProjectData} />;
      case 4:
        return <Step4TokenSettings data={projectData} onUpdate={updateProjectData} />;
      case 5:
        return <Step5RevenueModel data={projectData} onUpdate={updateProjectData} />;
      case 6:
        return <Step6ReviewCreate data={projectData} onCreate={handleCreateProject} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <ProgressIndicator currentStep={currentStep} totalSteps={TOTAL_STEPS} />
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 sm:p-8">
          {renderStep()}
        </div>

        <div className="bg-slate-50 border-t border-slate-200 px-6 sm:px-8 py-4 flex items-center justify-between">
          <div>
            <button
              onClick={handleSaveDraft}
              className="inline-flex items-center gap-2 px-4 py-2 text-slate-700 hover:text-slate-900 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span className="text-sm">Save Draft</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            {currentStep > 1 && (
              <button
                onClick={handleBack}
                className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
            )}
            
            {currentStep < TOTAL_STEPS && (
              <button
                onClick={handleNext}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {projectData.projectId && (
        <div className="text-center text-sm text-slate-500">
          Draft ID: {projectData.projectId}
        </div>
      )}
    </div>
  );
}
