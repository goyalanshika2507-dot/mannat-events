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

  return (
    <div className="space-y-8">

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

      <div className="flex justify-between">

        <Button
          variant="secondary"
          onClick={onPrev}
        >
          Previous
        </Button>

        <Button
          onClick={() =>
            onNext({
              special_requests: value,
            })
          }
        >
          Continue to Review
        </Button>

      </div>

    </div>
  )
}