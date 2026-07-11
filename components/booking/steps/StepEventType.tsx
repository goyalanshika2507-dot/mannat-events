'use client'

import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { BookingFormData } from '@/lib/types'
import { cn } from '@/lib/utils/cn'

const EVENTS = [
  {
    id: 'wedding',
    title: 'Wedding',
    description: 'Luxury wedding celebrations',
  },
  {
    id: 'birthday',
    title: 'Birthday',
    description: 'Birthday parties & family events',
  },
  {
    id: 'corporate',
    title: 'Corporate',
    description: 'Meetings & corporate retreats',
  },
  {
    id: 'engagement',
    title: 'Engagement',
    description: 'Elegant engagement ceremonies',
  },
]

interface Props {
  data: Partial<BookingFormData>
  onNext: (value: { event_type: string }) => void
  onPrev: () => void
}

export function StepEventType({
  data,
  onNext,
  onPrev,
}: Props) {
  const selected = data.event_type

  return (
    <div className="space-y-8">

      <div>
        <h2 className="text-3xl font-light">
          What type of event are you planning?
        </h2>

        <p className="text-[#737373] mt-3">
          Select the event that best matches your celebration.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-5">

        {EVENTS.map((event) => (

          <Card
            key={event.id}
            onClick={() => onNext({ event_type: event.id })}
            className={cn(
              'cursor-pointer p-8 transition-all duration-300 border-2 hover:-translate-y-1 hover:shadow-xl',

              selected === event.id
                ? 'border-[#C9A84C]'
                : 'border-transparent'
            )}
          >
            <h3 className="text-xl font-medium">
              {event.title}
            </h3>

            <p className="mt-3 text-sm text-[#737373]">
              {event.description}
            </p>

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

      </div>

    </div>
  )
}