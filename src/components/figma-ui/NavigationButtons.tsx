import { ChevronLeft, ChevronRight, Check } from 'lucide-react';

interface NavigationButtonsProps {
  currentStep: number;
  totalSteps: number;
  canProceed: boolean;
  onBack: () => void;
  onNext: () => void;
  onCreate: () => void;
}

export function NavigationButtons({
  currentStep,
  totalSteps,
  canProceed,
  onBack,
  onNext,
  onCreate,
}: NavigationButtonsProps) {
  return (
    <div className="flex items-center justify-between">
      <button
        onClick={onBack}
        disabled={currentStep === 1}
        className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all ${
          currentStep === 1
            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
            : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
        }`}
      >
        <ChevronLeft className="w-5 h-5" />
        Back
      </button>

      {currentStep < totalSteps ? (
        <button
          onClick={onNext}
          disabled={!canProceed}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all ${
            canProceed
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          Next Step
          <ChevronRight className="w-5 h-5" />
        </button>
      ) : (
        <button
          onClick={onCreate}
          disabled={!canProceed}
          className={`flex items-center gap-2 px-8 py-3 rounded-lg transition-all ${
            canProceed
              ? 'bg-emerald-600 text-white hover:bg-emerald-700'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          <Check className="w-5 h-5" />
          Create Project
        </button>
      )}
    </div>
  );
}
