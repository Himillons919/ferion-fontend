import { TrendingUp } from 'lucide-react';
import { RevenueModelInput } from '@/lib/validators';

type RevenueErrors = Partial<Record<keyof RevenueModelInput, string | undefined>>;
type OptionWithDescription = { value: string; label: string; description?: string };
type Option = { value: string; label: string };

interface StepProps {
  values: RevenueModelInput;
  errors?: RevenueErrors;
  revenueModes: OptionWithDescription[];
  capitalProfiles: OptionWithDescription[];
  distributionPolicies: OptionWithDescription[];
  distributionFrequencies: Option[];
  projectPreview?: {
    assetType?: string | null;
    tokenSymbol?: string | null;
    totalSupply?: number | null;
  };
  onChange: <K extends keyof RevenueModelInput>(
    key: K,
    value: RevenueModelInput[K] | undefined
  ) => void;
}

export function StepRevenueModel({
  values,
  errors,
  revenueModes,
  capitalProfiles,
  distributionPolicies,
  distributionFrequencies,
  projectPreview,
  onChange,
}: StepProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3 pb-4 border-b border-slate-200">
        <div className="p-2 bg-blue-50 rounded-lg">
          <TrendingUp className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-slate-900">Revenue Model</h2>
          <p className="text-slate-600 mt-1">
            Define the revenue structure and distribution strategy
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Revenue Mode */}
        <div>
          <label className="block text-slate-700 mb-3">
            Revenue Mode <span className="text-red-500">*</span>
          </label>
          <div className="space-y-3">
            {revenueModes.map((mode) => (
              <label
                key={mode.value}
                className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  values.revenueMode === mode.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="revenueMode"
                  value={mode.value}
                  checked={values.revenueMode === mode.value}
                  onChange={(e) => onChange('revenueMode', e.target.value)}
                  className="mt-1 w-4 h-4 text-blue-600 border-slate-300 focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex-1">
                  <div className="text-slate-900">{mode.label}</div>
                  {mode.description && <div className="text-slate-600 mt-1">{mode.description}</div>}
                </div>
              </label>
            ))}
          </div>
          {errors?.revenueMode && (
            <div className="mt-1 text-sm text-red-600">{errors.revenueMode}</div>
          )}
        </div>

        {/* Capital Profile */}
        <div>
          <label className="block text-slate-700 mb-3">
            Capital Profile <span className="text-red-500">*</span>
          </label>
          <div className="space-y-3">
            {capitalProfiles.map((profile) => (
              <label
                key={profile.value}
                className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  values.capitalProfile === profile.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="capitalProfile"
                  value={profile.value}
                  checked={values.capitalProfile === profile.value}
                  onChange={(e) => onChange('capitalProfile', e.target.value)}
                  className="mt-1 w-4 h-4 text-blue-600 border-slate-300 focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex-1">
                  <div className="text-slate-900">{profile.label}</div>
                  {profile.description && <div className="text-slate-600 mt-1">{profile.description}</div>}
                </div>
              </label>
            ))}
          </div>
          {errors?.capitalProfile && (
            <div className="mt-1 text-sm text-red-600">{errors.capitalProfile}</div>
          )}
        </div>

        {/* Target Annual Return */}
        <div>
          <label className="block text-slate-700 mb-2">
            Target Net Annual Return <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="number"
              value={values.annualReturn ?? ''}
              onChange={(e) =>
                onChange('annualReturn', e.target.value === '' ? undefined : Number(e.target.value))
              }
              placeholder="8.5"
              min="0"
              step="0.1"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                errors?.annualReturn ? 'border-red-300' : 'border-slate-300'
              }`}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">
              %
            </div>
          </div>
          {errors?.annualReturn && (
            <div className="mt-1 text-sm text-red-600">{errors.annualReturn}</div>
          )}
          <div className="mt-2 text-slate-500">
            Expected annual percentage return after fees and expenses
          </div>
        </div>

        {/* Distribution Policy */}
        <div>
          <label className="block text-slate-700 mb-3">
            Distribution Policy <span className="text-red-500">*</span>
          </label>
          <div className="space-y-3">
            {distributionPolicies.map((policy) => (
              <label
                key={policy.value}
                className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  values.distributionPolicy === policy.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="distributionPolicy"
                  value={policy.value}
                  checked={values.distributionPolicy === policy.value}
                  onChange={(e) => onChange('distributionPolicy', e.target.value)}
                  className="mt-1 w-4 h-4 text-blue-600 border-slate-300 focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex-1">
                  <div className="text-slate-900">{policy.label}</div>
                  {policy.description && <div className="text-slate-600 mt-1">{policy.description}</div>}
                </div>
              </label>
            ))}
          </div>
          {errors?.distributionPolicy && (
            <div className="mt-1 text-sm text-red-600">{errors.distributionPolicy}</div>
          )}
        </div>

        {/* Distribution Frequency */}
        <div>
          <label className="block text-slate-700 mb-2">
            Distribution Frequency <span className="text-red-500">*</span>
          </label>
          <select
            value={values.payoutFrequency}
            onChange={(e) => onChange('payoutFrequency', e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          >
            <option value="">Select frequency</option>
            {distributionFrequencies.map((freq) => (
              <option key={freq.value} value={freq.value}>
                {freq.label}
              </option>
            ))}
          </select>
          {errors?.payoutFrequency && (
            <div className="mt-1 text-sm text-red-600">{errors.payoutFrequency}</div>
          )}
        </div>

        {/* Project Summary Card */}
        {values.annualReturn !== undefined && values.payoutFrequency && (
          <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
            <div className="text-blue-900 mb-4">Project Summary</div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-700">Asset Type:</span>
                <span className="text-slate-900">{projectPreview?.assetType || 'Not set'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-700">Token Symbol:</span>
                <span className="text-slate-900">{projectPreview?.tokenSymbol || 'Not set'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-700">Total Supply:</span>
                <span className="text-slate-900">
                  {projectPreview?.totalSupply ? Number(projectPreview.totalSupply).toLocaleString() : 'Not set'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-700">Target Annual Return:</span>
                <span className="text-emerald-600">{values.annualReturn}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-700">Distribution:</span>
                <span className="text-slate-900 capitalize">{values.payoutFrequency}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
