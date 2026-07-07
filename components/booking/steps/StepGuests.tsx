'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { StepGuestsSchema, StepGuestsValues } from '@/lib/validators/booking'
import { BookingFormData } from '@/lib/types'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'

interface StepGuestsProps {
  data: Partial<BookingFormData>
  onNext: (data: StepGuestsValues) => void
  onPrev: () => void
}

export function StepGuests({ data, onNext, onPrev }: StepGuestsProps) {
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
    <form onSubmit={handleSubmit(onNext)} noValidate className="space-y-6">
      <div className="max-w-xs">
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
          {...register('guests', { valueAsNumber: true })}
        />
        <p className="mt-1.5 text-xs text-gray-500">Enter the total headcount for the event.</p>
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="secondary" size="lg" onClick={onPrev}>
          Previous
        </Button>
        <Button type="submit" size="lg">
          Next
        </Button>
      </div>
    </form>
  )
}
