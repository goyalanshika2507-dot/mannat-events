interface ProgressBarProps {
  currentStep: number   // 1-indexed
  totalSteps: number
  stepLabels: string[]
}

export function ProgressBar({ currentStep, totalSteps, stepLabels }: ProgressBarProps) {
  const percentage = Math.round((currentStep / totalSteps) * 100)

  return (
    <div className="mb-8">
      {/* Step info */}
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-gray-700">
          Step {currentStep} of {totalSteps}:{' '}
          <span className="text-gray-900">{stepLabels[currentStep - 1]}</span>
        </p>
        <p className="text-sm text-gray-500">{percentage}%</p>
      </div>

      {/* Progress track */}
      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gray-900 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Booking progress: ${percentage}%`}
        />
      </div>

      {/* Step dots */}
      <div className="flex justify-between mt-2">
        {stepLabels.map((label, i) => {
          const stepNum = i + 1
          const isCompleted = stepNum < currentStep
          const isCurrent = stepNum === currentStep
          return (
            <div key={label} className="flex flex-col items-center gap-1">
              <div
                className={[
                  'w-2 h-2 rounded-full',
                  isCompleted ? 'bg-gray-900' : isCurrent ? 'bg-gray-900' : 'bg-gray-300',
                ].join(' ')}
              />
              <span className={[
                'text-xs hidden sm:block',
                isCurrent ? 'text-gray-900 font-medium' : 'text-gray-400',
              ].join(' ')}>
                {label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
