import { cn } from '@/lib/utils/cn'

interface ProgressBarProps {
  currentStep: number   // 1-indexed
  totalSteps: number
  stepLabels: string[]
}

export function ProgressBar({ currentStep, totalSteps, stepLabels }: ProgressBarProps) {
  const percentage = Math.round((currentStep / totalSteps) * 100)

  return (
    <div className="mb-12">
      {/* Step description */}
      <div className="flex items-baseline justify-between mb-4">
        <div>
          <span className="text-caption text-[#C9A84C]">Step {currentStep} of {totalSteps}</span>
          <h2 className="text-xl font-light text-[#1A1A1A] mt-1 tracking-tight">
            {stepLabels[currentStep - 1]}
          </h2>
        </div>
        <span className="text-xs font-semibold text-[#A8A8A8] tracking-widest">{percentage}%</span>
      </div>

      {/* Modern, elegant progress track */}
      <div className="w-full h-1 bg-[#E8E5E0] rounded-full overflow-hidden mb-6">
        <div
          className="h-full bg-[#1A1A1A] rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Booking progress: ${percentage}%`}
        />
      </div>

      {/* Minimalist step dots/labels */}
      <div className="flex justify-between items-center px-1">
        {stepLabels.map((label, i) => {
          const stepNum = i + 1
          const isCompleted = stepNum < currentStep
          const isCurrent = stepNum === currentStep
          return (
            <div key={label} className="flex flex-col items-center gap-2">
              <div
                className={cn(
                  'w-1.5 h-1.5 rounded-full transition-all duration-300',
                  isCompleted ? 'bg-[#1A1A1A]' : isCurrent ? 'bg-[#C9A84C] scale-125' : 'bg-[#D4CFC9]'
                )}
              />
              <span className={cn(
                'text-[10px] uppercase font-bold tracking-widest hidden sm:block transition-all duration-300',
                isCurrent ? 'text-[#C9A84C]' : isCompleted ? 'text-[#1A1A1A]' : 'text-[#A8A8A8]'
              )}>
                {label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
