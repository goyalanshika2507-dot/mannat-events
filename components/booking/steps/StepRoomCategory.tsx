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
    <div className="space-y-8">

      <div>
        <h2 className="text-3xl font-light">
          Choose Room Category
        </h2>

        <p className="mt-3 text-[#737373]">
          Select the accommodation that best fits your event.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-5">

        {ROOMS.map(room => (

          <Card
            key={room.id}
            onClick={() =>
              onNext({
                room_category: room.id,
              })
            }
            className={cn(
              'cursor-pointer p-8 border-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl',

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

      <Button
        variant="secondary"
        onClick={onPrev}
      >
        Previous
      </Button>

    </div>
  )
}