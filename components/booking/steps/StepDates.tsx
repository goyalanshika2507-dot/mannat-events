'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { StepDatesSchema, StepDatesValues } from '@/lib/validators/booking'
import { calculateDuration, formatDate } from '@/lib/utils/booking'
import { BookingFormData } from '@/lib/types'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'

interface StepDatesProps {
  data: Partial<BookingFormData>
  onNext: (data: StepDatesValues) => void
}

export function StepDates({ data, onNext }: StepDatesProps) {
  const today = new Date().toISOString().split('T')[0]

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<StepDatesValues>({
    resolver: zodResolver(StepDatesSchema),
    defaultValues: {
      check_in: data.check_in ?? '',
      check_out: data.check_out ?? '',
    },
  })

  const checkIn = watch('check_in')
  const checkOut = watch('check_out')
  const duration = calculateDuration(checkIn, checkOut)

  // Logic: Agar checkIn change ho, toh purani invalid checkOut ko clear kar do
  useEffect(() => {
    if (checkIn && checkOut && checkOut <= checkIn) {
      setValue('check_out', '')
    }
  }, [checkIn, checkOut, setValue])

  return (
    <form onSubmit={handleSubmit(onNext)} noValidate className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="check_in" required>
            Check-in date
          </Label>
          <Input
            id="check_in"
            type="date"
            min={today}
            error={errors.check_in?.message}
            {...register('check_in')}
          />
        </div>

        <div>
          <Label htmlFor="check_out" required>
            Check-out date
          </Label>
          <Input
            id="check_out"
            type="date"
            min={checkIn || today}
            error={errors.check_out?.message}
            {...register('check_out')}
          />
        </div>
      </div>

      {/* Duration summary */}
      {duration > 0 && (
        <div className="rounded border border-gray-200 bg-gray-50 px-4 py-3">
          <p className="text-sm text-gray-700">
            <span className="font-medium">Duration:</span>{' '}
            {duration} {duration === 1 ? 'night' : 'nights'}
            {' '}({formatDate(checkIn)} &ndash; {formatDate(checkOut)})
          </p>
        </div>
      )}

      <div className="flex justify-end">
        <Button type="submit" size="lg">
          Next
        </Button>
      </div>
    </form>
  )
}