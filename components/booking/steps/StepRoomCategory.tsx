'use client'

import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { BookingFormData } from '@/lib/types'
import { cn } from '@/lib/utils/cn'

const ROOMS = [
  {
    id: 'standard',
    title: 'Standard Room',
    description: 'Comfortable stay with essential amenities.',
  },
  {
    id: 'deluxe',
    title: 'Deluxe Room',
    description: 'Spacious room with premium interiors.',
  },
  {
    id: 'suite',
    title: 'Luxury Suite',
    description: 'Elegant suite with luxury services.',
  },
  {
    id: 'villa',
    title: 'Private Villa',
    description: 'Exclusive villa for premium celebrations.',
  },
]

interface Props {
  data: Partial<BookingFormData>
  onNext: (value: { room_category: string }) => void
  onPrev: () => void
}

export function StepRoomCategory({
  data,
  onNext,
  onPrev,
}: Props) {
  const selected = data.room_category

  return (
    <div className="space-y-8 pb-24 md:pb-0">
      <div>
        <h2 className="text-3xl font-light">
          Choose Room Category
        </h2>

        <p className="mt-3 text-[#737373]">
          Select the accommodation that best fits your event.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {ROOMS.map((room) => (
          <Card
            key={room.id}
            as="button"
            onClick={() =>
              onNext({
                room_category: room.id,
              })
            }
            className={cn(
              'w-full text-left cursor-pointer p-8 transition-all duration-300 border-2 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C] focus-visible:ring-offset-2',
              selected === room.id
                ? 'border-[#C9A84C]'
                : 'border-transparent'
            )}
          >
            <h3 className="text-xl font-medium">
              {room.title}
            </h3>

            <p className="mt-3 text-sm text-[#737373]">
              {room.description}
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