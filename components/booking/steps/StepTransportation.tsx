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
    <div className="space-y-8 pb-24 md:pb-0">
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
              'w-full text-left cursor-pointer p-8 transition-all duration-300 border-2 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C] focus-visible:ring-offset-2',
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

      {/* Desktop Previous */}
      <div className="hidden md:flex justify-start">
        <Button
          type="button"
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