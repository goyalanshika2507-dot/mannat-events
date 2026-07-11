'use client'

import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { BookingFormData } from '@/lib/types'
import { cn } from '@/lib/utils/cn'

const OPTIONS = [
  {
    id: 'none',
    title: 'No Transportation',
    description: 'Guests will arrange their own travel',
  },
  {
    id: 'pickup',
    title: 'Pickup Service',
    description: 'Airport / Railway Station pickup',
  },
  {
    id: 'premium',
    title: 'Luxury Transportation',
    description: 'Premium cars & guest transfers',
  },
]

interface Props {
  data: Partial<BookingFormData>
  onNext: (value: { transportation: string }) => void
  onPrev: () => void
}

export function StepTransportation({
  data,
  onNext,
  onPrev,
}: Props) {

  const selected = data.transportation

  return (
    <div className="space-y-8">

      <div>
        <h2 className="text-3xl font-light">
          Transportation
        </h2>

        <p className="mt-3 text-[#737373]">
          Select transportation services for your guests.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-5">

        {OPTIONS.map((option) => (

          <Card
            key={option.id}
            as="button"
            onClick={() =>
              onNext({
                transportation: option.id,
              })
            }
            className={cn(
              'cursor-pointer p-6 border-2 transition-all hover:-translate-y-1 hover:shadow-xl',

              selected === option.id
                ? 'border-[#C9A84C]'
                : 'border-transparent'
            )}
          >
            <h3 className="text-xl font-medium">
              {option.title}
            </h3>

            <p className="mt-3 text-sm text-[#737373]">
              {option.description}
            </p>

          </Card>

        ))}

      </div>

      <Button
        variant="secondary"
        onClick={onPrev}
      >
        Previous
      </Button>

    </div>
  )
}