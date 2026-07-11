'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { BookingFormData } from '@/lib/types'

interface Props {
  data: Partial<BookingFormData>
  onNext: (value: { special_requests: string }) => void
  onPrev: () => void
}

export function StepSpecialRequests({
  data,
  onNext,
  onPrev,
}: Props) {
  const [value, setValue] = useState(
    data.special_requests ?? ''
  )

  function handleNext() {
    onNext({
      special_requests: value,
    })
  }

  return (
    <div className="space-y-8 pb-28 md:pb-0">
      <div>
        <h2 className="text-3xl font-light">
          Special Requests
        </h2>

        <p className="mt-3 text-[#737373]">
          Mention any additional requirements for your event.
        </p>
      </div>

      <textarea
        rows={8}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Example: Floral stage decoration, Jain food, wheelchair assistance, extra beds, late check-out, etc."
        className="w-full rounded-xl border border-[#E8E5E0] bg-white p-4 outline-none focus:border-[#C9A84C] resize-none"
      />

      {/* Desktop Navigation */}
      <div className="hidden md:flex justify-between">
        <Button
          type="button"
          variant="secondary"
          onClick={onPrev}
        >
          Previous
        </Button>

        <Button
          type="button"
          onClick={handleNext}
        >
          Continue to Review
        </Button>
      </div>

      {/* Mobile Sticky Bottom Navigation */}
      <div className="fixed md:hidden bottom-0 left-0 right-0 z-50 border-t border-[#E8E5E0] bg-white/95 backdrop-blur-md px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div className="max-w-lg mx-auto flex gap-3">
          <Button
            type="button"
            variant="secondary"
            size="lg"
            onClick={onPrev}
            className="shrink-0"
          >
            Previous
          </Button>

          <Button
            type="button"
            size="lg"
            onClick={handleNext}
            className="flex-1"
          >
            Continue to Review
          </Button>
        </div>
      </div>
    </div>
  )
}