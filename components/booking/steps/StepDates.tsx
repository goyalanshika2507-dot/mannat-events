'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  StepDatesSchema,
  StepDatesValues,
} from '@/lib/validators/booking'
import {
  calculateDuration,
  formatDate,
} from '@/lib/utils/booking'
import { BookingFormData } from '@/lib/types'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { CalendarDays } from 'lucide-react'

interface StepDatesProps {
  data: Partial<BookingFormData>
  onNext: (data: StepDatesValues) => void
}

export function StepDates({
  data,
  onNext,
}: StepDatesProps) {
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

  useEffect(() => {
    if (checkIn && checkOut && checkOut <= checkIn) {
      setValue('check_out', '')
    }
  }, [checkIn, checkOut, setValue])

  return (
    <form
      onSubmit={handleSubmit(onNext)}
      noValidate
      className="space-y-8 pb-24 md:pb-0"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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

      {duration > 0 && (
        <div className="rounded-[12px] border border-[#E8E5E0] bg-[#FAF8F5] px-6 py-4 flex items-center gap-4 transition-all duration-300">
          <div className="text-[#C9A84C] shrink-0">
            <CalendarDays size={20} />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#737373] mb-0.5">
              Stay Period
            </p>

            <p className="text-sm font-semibold text-[#1A1A1A]">
              {duration} {duration === 1 ? 'night' : 'nights'}

              <span className="font-normal text-[#737373] ml-1.5">
                ({formatDate(checkIn)} &ndash;{' '}
                {formatDate(checkOut)})
              </span>
            </p>
          </div>
        </div>
      )}

      {/* Desktop Next Button */}
      <div className="hidden md:flex justify-end pt-2">
        <Button type="submit" size="lg">
          Next Step
        </Button>
      </div>

      {/* Mobile Sticky Bottom Navigation */}
      <div className="fixed md:hidden bottom-0 left-0 right-0 z-50 border-t border-[#E8E5E0] bg-white/95 backdrop-blur-md px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div className="max-w-lg mx-auto">
          <Button
            type="submit"
            size="lg"
            className="w-full"
          >
            Next Step
          </Button>
        </div>
      </div>
    </form>
  )
}