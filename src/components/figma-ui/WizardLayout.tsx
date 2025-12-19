import { ReactNode } from 'react';
import { Check } from 'lucide-react';

interface Step {
  id: number;
  title: string;
}

interface WizardLayoutProps {
  currentStep: number;
  totalSteps: number;
  steps: Step[];
  children: ReactNode;
  onNext: () => void;
  onBack: () => void;
  className?: string;
  contentClassName?: string;
}

export function WizardLayout({
  currentStep,
  totalSteps,
  steps,
  children,
  className = "",
  contentClassName = "",
}: WizardLayoutProps) {
  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 ${className}`}
    >
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-white/50 bg-white/60 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-slate-900">
                Ferion RWA Platform
              </h1>
              <p className="mt-1 text-sm text-slate-600">Create New Project</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-slate-500">Draft Auto-saved</span>
              <div className="h-2 w-2 rounded-full bg-green-500" />
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="border-b border-white/40 bg-white/60 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-600">
              Step {currentStep} of {totalSteps}
            </p>
            <p className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-600">
              Guided Creation
            </p>
          </div>
          <div className="mt-4 flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-1 items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ${
                      step.id < currentStep
                        ? "border-orange-500 bg-orange-500 text-white"
                        : step.id === currentStep
                        ? "border-orange-500 bg-white text-orange-600 shadow-sm"
                        : "border-white/70 bg-white/50 text-slate-400"
                    }`}
                  >
                    {step.id < currentStep ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <span>{step.id}</span>
                    )}
                  </div>
                  <p
                    className={`mt-2 text-center text-sm ${
                      step.id === currentStep
                        ? "text-orange-600"
                        : step.id < currentStep
                        ? "text-slate-700"
                        : "text-slate-400"
                    }`}
                  >
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`mx-4 -mt-8 flex-1 h-0.5 transition-all ${
                      step.id < currentStep
                        ? "bg-orange-500"
                        : "bg-white/60"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
