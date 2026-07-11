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
      setSelected(selected.filter(item => item !== option))
    } else {
      setSelected([...selected, option])
    }
  }

  return (
    <div className="space-y-8">

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

      <div className="flex justify-between">

        <Button
          variant="secondary"
          onClick={onPrev}
        >
          Previous
        </Button>

        <Button
          onClick={() =>
            onNext({
              entertainment: selected,
            })
          }
        >
          Next
        </Button>

      </div>

    </div>
  )
}