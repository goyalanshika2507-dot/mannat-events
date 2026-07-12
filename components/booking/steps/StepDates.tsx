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
    className="pb-24 md:pb-0"
  >
    {/* Date Fields */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
      <div className="space-y-3">
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

      <div className="space-y-3">
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

    {/* Stay Summary */}
    {duration > 0 && (
      <div className="mt-8 rounded-2xl border border-[#E8E2D8] bg-[#FDFCFA] px-6 py-5 flex items-start gap-4">
        <div className="w-11 h-11 rounded-xl bg-[#F5EDD6] flex items-center justify-center text-[#C5A85C] shrink-0">
          <CalendarDays size={21} strokeWidth={1.7} />
        </div>

        <div>
          <p className="text-sm font-semibold text-[#1A1A1A]">
            {duration} {duration === 1 ? 'night' : 'nights'}
          </p>

          <p className="mt-1 text-sm text-[#737373] leading-relaxed">
            {formatDate(checkIn)} – {formatDate(checkOut)}
          </p>
        </div>
      </div>
    )}

    {/* Desktop Navigation */}
    <div className="hidden md:flex justify-end mt-10 pt-6 border-t border-[#E8E2D8]">
      <Button type="submit" size="lg">
        Next Step
      </Button>
    </div>

    {/* Mobile Navigation */}
    <div className="fixed md:hidden bottom-0 left-0 right-0 z-50 border-t border-[#E8E2D8] bg-white/95 backdrop-blur-md px-5 py-4 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
      <Button type="submit" size="lg" className="w-full">
        Next Step
      </Button>
    </div>
  </form>
)
}