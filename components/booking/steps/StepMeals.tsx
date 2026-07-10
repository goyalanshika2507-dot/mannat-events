'use client'

import { useState, useEffect } from 'react'
import { DayMeal, BookingFormData } from '@/lib/types'
import { generateDefaultMeals } from '@/lib/utils/booking'
import { MealDaySelector } from '@/components/booking/MealDaySelector'
import { Button } from '@/components/ui/Button'
import { CalendarDays } from 'lucide-react'

interface StepMealsProps {
  data: Partial<BookingFormData>
  duration: number
  onNext: (data: { meals: DayMeal[] }) => void
  onPrev: () => void
}

export function StepMeals({ data, duration, onNext, onPrev }: StepMealsProps) {
  const [meals, setMeals] = useState<DayMeal[]>(() => {
    if (data.meals && data.meals.length === duration) {
      return data.meals
    }
    return generateDefaultMeals(duration)
  })

  useEffect(() => {
    setMeals((prev) => {
      if (prev.length === duration) return prev
      return generateDefaultMeals(duration)
    })
  }, [duration])

  function handleDayChange(updated: DayMeal) {
    setMeals((prev) =>
      prev.map((m) => (m.day === updated.day ? updated : m))
    )
  }

  function handleSubmit() {
    onNext({ meals })
  }

  if (duration === 0) {
    return (
      <div className="text-center py-12 border border-dashed border-[#E8E5E0] rounded-[14px]">
        <p className="text-sm text-[#737373]">No dates selected. Please return and specify dates.</p>
        <Button variant="secondary" onClick={onPrev} className="mt-4">
          Go Back
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 bg-[#F5EDD6] border border-[#E8E5E0] px-5 py-4 rounded-[12px]">
        <CalendarDays className="text-[#C9A84C] shrink-0" size={18} />
        <p className="text-xs font-semibold uppercase tracking-wider text-[#737373] leading-relaxed">
          Daily Cuisine Customization for <span className="text-[#1A1A1A] font-bold">{duration} Night{duration > 1 ? 's' : ''}</span>. Breakfast is complementary.
        </p>
      </div>

      <div className="space-y-4">
        {meals.map((dayMeal) => (
          <MealDaySelector
            key={dayMeal.day}
            dayMeal={dayMeal}
            onChange={handleDayChange}
          />
        ))}
      </div>

      <div className="flex flex-col-reverse sm:flex-row justify-between gap-4 pt-2">
        <Button type="button" variant="secondary" size="lg" onClick={onPrev} className="w-full sm:w-auto">
          Previous
        </Button>
        <Button type="button" size="lg" onClick={handleSubmit} className="w-full sm:w-auto">
          Next Step
        </Button>
      </div>
    </div>
  )
}
