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
    <form onSubmit={handleSubmit(onNext)} noValidate className="space-y-8">
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
          {...register('guests', { valueAsNumber: true })}
        />
      </div>

      <div className="flex flex-col-reverse sm:flex-row justify-between gap-4 pt-2">
        <Button type="button" variant="secondary" size="lg" onClick={onPrev} className="w-full sm:w-auto">
          Previous
        </Button>
        <Button type="submit" size="lg" className="w-full sm:w-auto">
          Next Step
        </Button>
      </div>
    </form>
  )
}
