import { AlertCircle, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { Doc, Project } from '@/types/project';

interface StepProps {
  project: Project | null;
  documents?: Doc[];
}

type SectionItem = {
  label: string;
  value: string | number | null | undefined;
  capitalize?: boolean;
};

export function StepReviewCreate({ project, documents = [] }: StepProps) {
  const [expandedSections, setExpandedSections] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: true,
    4: true,
    5: true,
  });

  const toggleSection = (section: number) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const sections: Array<{ id: number; title: string; items: SectionItem[] }> = [
    {
      id: 1,
      title: 'Project Basics',
      items: [
        { label: 'Project Name', value: project?.name },
        { label: 'Asset Type', value: project?.assetType },
        { label: 'Description', value: project?.description ?? 'Not provided' },
        { label: 'Accept Institutional', value: project?.acceptInstitutionalInvestors ? 'Yes' : 'No' },
      ],
    },
    {
      id: 2,
      title: 'Blockchain Settings',
      items: [
        { label: 'Wallet Address', value: project?.walletAddress },
        { label: 'Network', value: project?.network },
      ],
    },
    {
      id: 3,
      title: 'Asset Details',
      items: [
        { label: 'Location/Jurisdiction', value: project?.assetLocation },
        { label: 'Description', value: project?.assetDescription },
        { 
          label: 'Asset Value', 
          value: project?.assetValue !== null && project?.assetValue !== undefined
            ? `$${Number(project.assetValue).toLocaleString()}`
            : 'Not provided' 
        },
        { label: 'Documents Uploaded', value: `${documents.length} file(s)` },
      ],
    },
    {
      id: 4,
      title: 'Token Settings',
      items: [
        { label: 'Token Name', value: project?.tokenName },
        { label: 'Token Symbol', value: project?.tokenSymbol },
        { label: 'Total Supply', value: project?.totalSupply?.toLocaleString() },
        { label: 'Decimals', value: project?.tokenDecimals },
        { label: 'Initial Price', value: project?.initialPrice ? `$${project.initialPrice}` : '-' },
      ],
    },
    {
      id: 5,
      title: 'Revenue Model',
      items: [
        { label: 'Revenue Mode', value: project?.revenueMode, capitalize: true },
        { label: 'Capital Profile', value: project?.capitalProfile, capitalize: true },
        { 
          label: 'Target Annual Return', 
          value: project?.annualReturn !== null && project?.annualReturn !== undefined
            ? `${project.annualReturn}%`
            : '-' 
        },
        { label: 'Distribution Policy', value: project?.distributionPolicy, capitalize: true },
        { label: 'Distribution Frequency', value: project?.payoutFrequency, capitalize: true },
        { label: 'Distribution Notes', value: project?.distributionNotes ?? '-', capitalize: false },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center pb-4 border-b border-slate-200">
        <h2 className="text-slate-900">Review & Create</h2>
        <p className="text-slate-600 mt-2">
          Review all information before creating your project
        </p>
      </div>

      {/* Important Notice Banner */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-amber-900">Important Notice</div>
            <div className="text-amber-800 mt-1">
              Some parameters such as Token Symbol and Blockchain Network cannot be changed 
              after smart contract deployment in the Developing phase. Please verify all information carefully.
            </div>
          </div>
        </div>
      </div>

      {/* Summary Sections */}
      <div className="space-y-3">
        {sections.map((section) => (
          <div key={section.id} className="border border-slate-200 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                  {section.id}
                </div>
                <span className="text-slate-900">{section.title}</span>
              </div>
              {expandedSections[section.id] ? (
                <ChevronUp className="w-5 h-5 text-slate-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-slate-500" />
              )}
            </button>

            {expandedSections[section.id] && (
              <div className="p-4 bg-white space-y-3">
                {section.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-start py-2">
                    <span className="text-slate-600">{item.label}:</span>
                    <span className={`text-slate-900 text-right max-w-md ${
                      item.capitalize ? 'capitalize' : ''
                    }`}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Status Summary */}
      <div className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="text-emerald-900">Ready to Create</div>
            <div className="text-emerald-800 mt-1">
              All required information has been provided. Click &quot;Create Project&quot; to finalize your draft.
            </div>
            <div className="mt-4 pt-4 border-t border-emerald-200 space-y-2">
              <div className="flex justify-between text-emerald-900">
                <span>Initial Status:</span>
                <span className="bg-emerald-600 text-white px-3 py-1 rounded">Draft</span>
              </div>
              <div className="flex justify-between text-emerald-900">
                <span>Lifecycle Stage:</span>
                <span>CreatingCompleted</span>
              </div>
              <div className="flex justify-between text-emerald-900">
                <span>Next Phase:</span>
                <span>Project Planning (In Progress)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* What Happens Next */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="text-blue-900 mb-2">What happens next?</div>
        <ul className="space-y-2 text-blue-700">
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-1">•</span>
            <span>Your project will be saved as a Draft</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-1">•</span>
            <span>You&apos;ll be redirected to the Project Overview page</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-1">•</span>
            <span>You can proceed to the Developing phase for smart contract development</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-1">•</span>
            <span>Document review, KYC configuration, and compliance steps will be available</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
