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
    <div className="space-y-8 pb-24 md:pb-0">
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
            as="button"
            onClick={() => onNext({ event_type: event.id })}
            className={cn(
              'w-full text-left cursor-pointer p-8 transition-all duration-300 border-2 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C] focus-visible:ring-offset-2',
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

      {/* Desktop Previous */}
      <div className="hidden md:flex justify-start">
        <Button
          variant="secondary"
          onClick={onPrev}
        >
          Previous
        </Button>
      </div>

      {/* Mobile Sticky Bottom Navigation */}
      <div className="fixed md:hidden bottom-0 left-0 right-0 z-50 border-t border-[#E8E5E0] bg-white/95 backdrop-blur-md px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div className="max-w-lg mx-auto">
          <Button
            type="button"
            variant="secondary"
            size="lg"
            onClick={onPrev}
            className="w-full"
          >
            Previous
          </Button>
        </div>
      </div>
    </div>
  )
}