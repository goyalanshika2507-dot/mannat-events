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
    <div className="space-y-8 pb-24 md:pb-0">
      <div>
        <h2 className="text-3xl font-light">
          Entertainment
        </h2>

        <p className="mt-3 text-[#737373]">
          Choose entertainment options for your event.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {OPTIONS.map((option) => (
          <Card
            key={option}
            as="button"
            onClick={() => toggle(option)}
            className={cn(
              'cursor-pointer p-6 border-2 transition-all hover:-translate-y-1 hover:shadow-lg',
              selected.includes(option)
                ? 'border-[#C9A84C]'
                : 'border-transparent'
            )}
          >
            <h3 className="text-lg font-medium">
              {option}
            </h3>
          </Card>
        ))}
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex justify-between">
        <Button
          type="button"
          variant="secondary"
          onClick={onPrev}
        >
          Previous
        </Button>

        <Button
          type="button"
          onClick={handleNext}
        >
          Next
        </Button>
      </div>

      {/* Mobile Sticky Bottom Navigation */}
      <div className="fixed md:hidden bottom-0 left-0 right-0 z-50 border-t border-[#E8E5E0] bg-white/95 backdrop-blur-md px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
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
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}