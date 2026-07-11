'use client'

import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { BookingFormData } from '@/lib/types'
import { cn } from '@/lib/utils/cn'

const OPTIONS = [
  {
    id: 'basic',
    title: 'Basic Photography',
    description: 'Professional photographer for the event',
  },
  {
    id: 'premium',
    title: 'Premium Photography',
    description: 'Photography + Cinematic Videography',
  },
  {
    id: 'luxury',
    title: 'Luxury Package',
    description: 'Drone + Cinematic Film + Album',
  },
]

interface Props {
  data: Partial<BookingFormData>
  onNext: (value: { photography: string }) => void
  onPrev: () => void
}

export function StepPhotography({
  data,
  onNext,
  onPrev,
}: Props) {
  const selected = data.photography

  return (
    <div className="space-y-8">

      <div>
        <h2 className="text-3xl font-light">
          Photography Package
        </h2>

        <p className="mt-3 text-[#737373]">
          Choose the photography package for your event.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-5">

        {OPTIONS.map((option) => (

          <Card
            key={option.id}
            as="button"
            onClick={() =>
              onNext({
                photography: option.id,
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