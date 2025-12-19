import { ReactNode } from 'react';
import { ChevronLeft, ChevronRight, Save } from 'lucide-react';

interface StepContainerProps {
  title: string;
  description: string;
  children: ReactNode;
  onValidate: () => boolean;
  isLastStep?: boolean;
}

export function StepContainer({ title, description, children, onValidate, isLastStep }: StepContainerProps) {
  const handleNext = () => {
    if (onValidate()) {
      const event = new CustomEvent('wizardNext');
      window.dispatchEvent(event);
    }
  };

  const handleBack = () => {
    const event = new CustomEvent('wizardBack');
    window.dispatchEvent(event);
  };

  // Listen for wizard events
  if (typeof window !== 'undefined') {
    window.addEventListener('wizardNext', () => {});
    window.addEventListener('wizardBack', () => {});
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200">
      {/* Header */}
      <div className="border-b border-slate-200 px-8 py-6">
        <h2 className="text-slate-900">{title}</h2>
        <p className="text-slate-600 mt-2">{description}</p>
      </div>

      {/* Content */}
      <div className="px-8 py-6">{children}</div>

      {/* Footer */}
      <div className="border-t border-slate-200 px-8 py-6 bg-slate-50 rounded-b-lg">
        <div className="flex items-center justify-between">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:text-slate-900 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onValidate()}
              className="flex items-center gap-2 px-4 py-2 text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <Save className="w-4 h-4" />
              Save Draft
            </button>
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {isLastStep ? 'Create Project' : 'Next'}
              {!isLastStep && <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
