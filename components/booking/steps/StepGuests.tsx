'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  StepGuestsSchema,
  StepGuestsValues,
} from '@/lib/validators/booking'
import { BookingFormData } from '@/lib/types'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'

interface StepGuestsProps {
  data: Partial<BookingFormData>
  onNext: (data: StepGuestsValues) => void
  onPrev: () => void
}

export function StepGuests({
  data,
  onNext,
  onPrev,
}: StepGuestsProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StepGuestsValues>({
    resolver: zodResolver(StepGuestsSchema),
    defaultValues: {
      guests: data.guests ?? undefined,
    },
  })

  return (
    <form
      onSubmit={handleSubmit(onNext)}
      noValidate
      className="space-y-8 pb-24 md:pb-0"
    >
      <div className="max-w-md">
        <Label htmlFor="guests" required>
          Number of guests
        </Label>

        <Input
          id="guests"
          type="number"
          min={1}
          max={500}
          placeholder="e.g. 100"
          error={errors.guests?.message}
          hint="Specify total attendance to ensure seamless room and meal arrangements."
          {...register('guests', {
            valueAsNumber: true,
          })}
        />
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex justify-between gap-4 pt-2">
        <Button
          type="button"
          variant="secondary"
          size="lg"
          onClick={onPrev}
        >
          Previous
        </Button>

        <Button type="submit" size="lg">
          Next Step
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
            className="flex-1"
          >
            Previous
          </Button>

          <Button
            type="submit"
            size="lg"
            className="flex-1"
          >
            Next Step
          </Button>
        </div>
      </div>
    </form>
  )
}