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
  <div className="pb-24 md:pb-0">
    {/* Section Introduction */}
    <div className="mb-8">
      <h2 className="text-2xl md:text-3xl font-serif font-medium text-[#1A1A1A]">
        What type of event are you planning?
      </h2>

      <p className="mt-3 text-base text-[#737373] leading-relaxed">
        Select the option that best matches your celebration.
      </p>
    </div>

    {/* Event Options */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {EVENTS.map((event) => (
        <Card
          key={event.id}
          as="button"
          onClick={() => onNext({ event_type: event.id })}
          className={cn(
            'w-full min-h-[150px] text-left cursor-pointer p-7 rounded-2xl border transition-all duration-300',
            'hover:-translate-y-0.5 hover:shadow-md',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A85C] focus-visible:ring-offset-2',
            selected === event.id
              ? 'border-[#C5A85C] bg-[#FDFCFA] shadow-sm'
              : 'border-[#E8E2D8] bg-white'
          )}
        >
          <h3 className="text-xl font-serif font-medium text-[#1A1A1A]">
            {event.title}
          </h3>

          <p className="mt-3 text-base text-[#737373] leading-relaxed">
            {event.description}
          </p>
        </Card>
      ))}
    </div>

    {/* Desktop Navigation */}
    <div className="hidden md:flex justify-start mt-10 pt-6 border-t border-[#E8E2D8]">
      <Button
        type="button"
        variant="secondary"
        size="lg"
        onClick={onPrev}
      >
        Previous
      </Button>
    </div>

    {/* Mobile Navigation */}
    <div className="fixed md:hidden bottom-0 left-0 right-0 z-50 border-t border-[#E8E2D8] bg-white/95 backdrop-blur-md px-5 py-4 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
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
)
}