import { Building2 } from 'lucide-react';
import { ProjectBasicsInput } from '@/lib/validators';

type BasicsErrors = Partial<Record<keyof ProjectBasicsInput, string | undefined>>;

interface StepProps {
  values: ProjectBasicsInput;
  errors?: BasicsErrors;
  assetTypes: string[];
  onChange: <K extends keyof ProjectBasicsInput>(
    key: K,
    value: ProjectBasicsInput[K]
  ) => void;
}

export function StepProjectBasics({ values, errors, assetTypes, onChange }: StepProps) {
  const projectName = values.projectName ?? '';
  const assetType = values.assetType ?? '';
  const projectDescription = values.projectDescription ?? '';
  const acceptInstitutionalInvestors = Boolean(values.acceptInstitutionalInvestors);

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3 pb-4 border-b border-slate-200">
        <div className="p-2 bg-orange-50 rounded-lg">
          <Building2 className="w-6 h-6 text-orange-600" />
        </div>
        <div>
          <h2 className="text-slate-900">Project Basics</h2>
          <p className="text-slate-600 mt-1">
            Define your project&apos;s fundamental information and asset type
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Project Name */}
        <div>
          <label className="block text-slate-700 mb-2">
            Project Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => onChange('projectName', e.target.value)}
            placeholder="Enter project name (1-100 characters)"
            maxLength={100}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all ${
              errors?.projectName ? 'border-red-300' : 'border-slate-300'
            }`}
          />
          {errors?.projectName && (
            <div className="mt-1 text-sm text-red-600">{errors.projectName}</div>
          )}
          <div className="mt-1 text-slate-500">
            {projectName.length}/100 characters
          </div>
        </div>

        {/* Asset Type */}
        <div>
          <label className="block text-slate-700 mb-2">
            Asset Type <span className="text-red-500">*</span>
          </label>
          <select
            value={assetType}
            onChange={(e) => onChange('assetType', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all bg-white ${
              errors?.assetType ? 'border-red-300' : 'border-slate-300'
            }`}
          >
            <option value="">Select asset type</option>
            {assetTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors?.assetType && (
            <div className="mt-1 text-sm text-red-600">{errors.assetType}</div>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-slate-700 mb-2">
            Description <span className="text-slate-400">(Optional)</span>
          </label>
          <textarea
            value={projectDescription}
            onChange={(e) => onChange('projectDescription', e.target.value)}
            placeholder="Brief project description..."
            rows={4}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all resize-none ${
              errors?.projectDescription ? 'border-red-300' : 'border-slate-300'
            }`}
          />
          {errors?.projectDescription && (
            <div className="mt-1 text-sm text-red-600">{errors.projectDescription}</div>
          )}
        </div>

        {/* Accept Institutional Investors */}
        <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <input
            type="checkbox"
            id="institutional"
            checked={acceptInstitutionalInvestors}
            onChange={(e) => onChange('acceptInstitutionalInvestors', e.target.checked)}
            className="mt-1 w-4 h-4 text-orange-600 border-slate-300 rounded focus:ring-2 focus:ring-orange-500"
          />
          <label htmlFor="institutional" className="flex-1 cursor-pointer">
            <div className="text-slate-900">Accept Institutional Investors</div>
            <div className="text-slate-600 mt-1">
              Allow qualified institutional investors to participate in this project
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}

