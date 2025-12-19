import { Check } from 'lucide-react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const stepNames = [
  'Project Basics',
  'Blockchain Settings',
  'Asset Details',
  'Token Settings',
  'Revenue Model',
  'Review & Create'
];

export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  return (
    <div className="mb-8">
      {/* Step indicator text */}
      <div className="text-center mb-4 text-slate-600">
        Step {currentStep} of {totalSteps}
      </div>

      {/* Progress dots */}
      <div className="flex items-center justify-between max-w-3xl mx-auto">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step, index) => (
          <div key={step} className="flex items-center flex-1">
            {/* Step circle */}
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  step < currentStep
                    ? 'bg-emerald-500 text-white'
                    : step === currentStep
                    ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                    : 'bg-slate-200 text-slate-400'
                }`}
              >
                {step < currentStep ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span>{step}</span>
                )}
              </div>
              <div className="mt-2 text-center">
                <div className={`text-xs ${step === currentStep ? 'text-blue-600' : 'text-slate-500'}`}>
                  {stepNames[index]}
                </div>
              </div>
            </div>

            {/* Connecting line */}
            {index < totalSteps - 1 && (
              <div
                className={`h-0.5 flex-1 -mt-6 transition-all ${
                  step < currentStep ? 'bg-emerald-500' : 'bg-slate-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
