import { Check } from 'lucide-react';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const STEP_LABELS = [
  'Project Basics',
  'Blockchain Settings',
  'Asset Details',
  'Token Settings',
  'Revenue Model',
  'Review & Create',
];

export function ProgressIndicator({ currentStep, totalSteps }: ProgressIndicatorProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="mb-4">
        <p className="text-sm text-slate-600">
          Step {currentStep} of {totalSteps}
        </p>
        <h2 className="text-slate-900 mt-1">{STEP_LABELS[currentStep - 1]}</h2>
      </div>

      <div className="relative">
        {/* Progress bar background */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-slate-200" />
        
        {/* Progress bar fill */}
        <div
          className="absolute top-5 left-0 h-0.5 bg-blue-600 transition-all duration-500"
          style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
        />

        {/* Step indicators */}
        <div className="relative flex justify-between">
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => {
            const isCompleted = step < currentStep;
            const isCurrent = step === currentStep;
            
            return (
              <div key={step} className="flex flex-col items-center">
                <div
                  className={`
                    w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all
                    ${isCompleted ? 'bg-blue-600 border-blue-600' : ''}
                    ${isCurrent ? 'bg-white border-blue-600' : ''}
                    ${!isCompleted && !isCurrent ? 'bg-white border-slate-300' : ''}
                  `}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5 text-white" />
                  ) : (
                    <span
                      className={`text-sm ${
                        isCurrent ? 'text-blue-600' : 'text-slate-400'
                      }`}
                    >
                      {step}
                    </span>
                  )}
                </div>
                
                <span
                  className={`mt-2 text-xs text-center max-w-[80px] hidden sm:block ${
                    isCurrent ? 'text-slate-900' : 'text-slate-500'
                  }`}
                >
                  {STEP_LABELS[step - 1]}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
