import { cn } from '@/lib/utils/cn'

interface ProgressBarProps {
  currentStep: number   // 1-indexed
  totalSteps: number
  stepLabels: string[]
}

export function ProgressBar({ currentStep, totalSteps, stepLabels }: ProgressBarProps) {
  const percentage = Math.round((currentStep / totalSteps) * 100)

  return (
    <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm pt-2 pb-6 border-b border-[#E8E5E0] mb-10">
      {/* Step description */}
      <div className="flex items-baseline justify-between mb-6">
        <div>
          <span className="text-xs font-bold tracking-widest text-[#C9A84C] uppercase">
            Step {currentStep} of {totalSteps}
          </span>
          <h2 className="text-3xl font-light text-[#1A1A1A] mt-2 tracking-tight">
            {stepLabels[currentStep - 1]}
          </h2>
        </div>
        <span className="text-sm font-semibold text-[#1A1A1A]">{percentage}%</span>
      </div>

      {/* Modern, elegant progress track */}
      <div className="w-full h-1.5 bg-[#E8E5E0] rounded-full overflow-hidden mb-8">
        <div
          className="h-full bg-[#1A1A1A] transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
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
                  'w-2 h-2 rounded-full transition-all duration-300',
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