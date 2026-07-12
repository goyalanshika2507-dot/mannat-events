'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { BookingFormData } from '@/lib/types'
import { cn } from '@/lib/utils/cn'

const OPTIONS = [
  'DJ',
  'Live Band',
  'Dance Performance',
  'Anchor / Host',
  'Fireworks',
  'Kids Activities',
]

interface Props {
  data: Partial<BookingFormData>
  onNext: (value: { entertainment: string[] }) => void
  onPrev: () => void
}

export function StepEntertainment({
  data,
  onNext,
  onPrev,
}: Props) {
  const [selected, setSelected] = useState<string[]>(
    data.entertainment ?? []
  )

  function toggle(option: string) {
    if (selected.includes(option)) {
      setSelected(selected.filter((item) => item !== option))
    } else {
      setSelected([...selected, option])
    }
  }

  function handleNext() {
    onNext({
      entertainment: selected,
    })
  }

  return (
  <div className="pb-24 md:pb-0">
    {/* Section Introduction */}
    <div className="mb-8">
      <h2 className="text-2xl md:text-3xl font-serif font-medium text-[#1A1A1A]">
        Choose Entertainment
      </h2>

      <p className="mt-3 text-base text-[#737373] leading-relaxed">
        Select one or more entertainment options for your event.
      </p>
    </div>

    {/* Entertainment Options */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {OPTIONS.map((option) => {
        const isSelected = selected.includes(option)

        return (
          <Card
            key={option}
            as="button"
            onClick={() => toggle(option)}
            className={cn(
              'w-full min-h-[110px] text-left cursor-pointer p-6 rounded-2xl border transition-all duration-300',
              'hover:-translate-y-0.5 hover:shadow-md',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A85C] focus-visible:ring-offset-2',
              isSelected
                ? 'border-[#C5A85C] bg-[#FDFCFA] shadow-sm'
                : 'border-[#E8E2D8] bg-white'
            )}
          >
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-lg font-serif font-medium text-[#1A1A1A]">
                {option}
              </h3>

              <div
                className={cn(
                  'w-5 h-5 shrink-0 rounded-full border flex items-center justify-center transition-all duration-200',
                  isSelected
                    ? 'border-[#C5A85C] bg-[#C5A85C]'
                    : 'border-[#CFC8BD] bg-white'
                )}
              >
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>
            </div>
          </Card>
        )
      })}
    </div>

    {/* Desktop Navigation */}
    <div className="hidden md:flex justify-between items-center mt-10 pt-6 border-t border-[#E8E2D8]">
      <Button
        type="button"
        variant="secondary"
        size="lg"
        onClick={onPrev}
      >
        Previous
      </Button>

      <Button
        type="button"
        size="lg"
        onClick={handleNext}
      >
        Next Step
      </Button>
    </div>

    {/* Mobile Navigation */}
    <div className="fixed md:hidden bottom-0 left-0 right-0 z-50 border-t border-[#E8E2D8] bg-white/95 backdrop-blur-md px-5 py-4 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
      <div className="max-w-lg mx-auto flex gap-3">
        <Button
          type="button"
          variant="secondary"
          size="lg"
          onClick={onPrev}
          className="flex-1"
        >
          Previous
        </Button>

        <Button
          type="button"
          size="lg"
          onClick={handleNext}
          className="flex-1"
        >
          Next Step
        </Button>
      </div>
    </div>
  </div>
)
}