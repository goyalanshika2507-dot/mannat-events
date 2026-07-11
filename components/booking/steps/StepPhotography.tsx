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
    <div className="space-y-8 pb-24 md:pb-0">
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