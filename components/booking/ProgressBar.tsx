interface ProgressBarProps {
  currentStep: number
  totalSteps: number
  stepLabels: string[]
}

export function ProgressBar({
  currentStep,
  totalSteps,
  stepLabels,
}: ProgressBarProps) {
  const percentage = Math.round((currentStep / totalSteps) * 100)

  return (
    <div className="w-full py-5 border-b border-[#E8E2D8]">
      {/* Step information */}
      <div className="flex items-end justify-between gap-6 mb-5">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.18em] text-[#C5A85C] uppercase">
            Step {currentStep} of {totalSteps}
          </p>

          <h2 className="mt-2 text-2xl md:text-3xl font-serif font-medium text-[#1A1A1A]">
            {stepLabels[currentStep - 1]}
          </h2>
        </div>

        <span className="text-sm font-medium text-[#737373]">
          {percentage}% complete
        </span>
      </div>

      {/* Progress bar */}
      <div
        className="w-full h-2 bg-[#EDE9E3] rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full bg-[#C5A85C] rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Current journey context */}
      <div className="mt-3 flex items-center justify-between text-xs text-[#8A8A8A]">
        <span>
          {currentStep > 1
            ? `Previous: ${stepLabels[currentStep - 2]}`
            : 'Getting started'}
        </span>

        <span>
          {currentStep < totalSteps
            ? `Next: ${stepLabels[currentStep]}`
            : 'Final step'}
        </span>
      </div>
    </div>
  )
}