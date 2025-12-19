import { ProjectData } from './ProjectCreationWizard';

interface Step1Props {
  data: ProjectData;
  onUpdate: (updates: Partial<ProjectData>) => void;
}

const ASSET_TYPES = [
  { value: '', label: 'Select asset type...' },
  { value: 'private_equity', label: 'Private Equity' },
  { value: 'debt', label: 'Debt' },
  { value: 'real_estate', label: 'Real Estate' },
  { value: 'art', label: 'Art' },
  { value: 'carbon_credits', label: 'Carbon Credits' },
  { value: 'commodities', label: 'Commodities' },
  { value: 'infrastructure', label: 'Infrastructure' },
  { value: 'other', label: 'Other' },
];

export function Step1ProjectBasics({ data, onUpdate }: Step1Props) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-slate-900 mb-1">Project Basics</h3>
        <p className="text-sm text-slate-600">
          Set up the fundamental information for your RWA project
        </p>
      </div>

      <div className="space-y-5">
        {/* Project Name */}
        <div>
          <label htmlFor="projectName" className="block text-sm text-slate-700 mb-2">
            Project Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="projectName"
            value={data.projectName}
            onChange={(e) => onUpdate({ projectName: e.target.value })}
            placeholder="Enter project name (1-100 characters)"
            maxLength={100}
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-slate-500 mt-1.5">
            {data.projectName.length}/100 characters
          </p>
        </div>

        {/* Asset Type */}
        <div>
          <label htmlFor="assetType" className="block text-sm text-slate-700 mb-2">
            Asset Type <span className="text-red-500">*</span>
          </label>
          <select
            id="assetType"
            value={data.assetType}
            onChange={(e) => onUpdate({ assetType: e.target.value })}
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            {ASSET_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm text-slate-700 mb-2">
            Project Description
          </label>
          <textarea
            id="description"
            value={data.description}
            onChange={(e) => onUpdate({ description: e.target.value })}
            placeholder="Provide a brief overview of your project..."
            rows={4}
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Accept Institutional Investors */}
        <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <input
            type="checkbox"
            id="acceptInstitutional"
            checked={data.acceptInstitutional}
            onChange={(e) => onUpdate({ acceptInstitutional: e.target.checked })}
            className="mt-0.5 w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex-1">
            <label htmlFor="acceptInstitutional" className="block text-sm text-slate-900 cursor-pointer">
              Accept Institutional Investors
            </label>
            <p className="text-xs text-slate-600 mt-1">
              Allow qualified institutional buyers to participate in this project
            </p>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          <strong>Note:</strong> Once you click Next, a project ID will be generated and your draft will be saved automatically.
        </p>
      </div>
    </div>
  );
}
