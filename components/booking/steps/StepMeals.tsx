'use client'

import { useState, useEffect } from 'react'
import { DayMeal, BookingFormData } from '@/lib/types'
import { generateDefaultMeals } from '@/lib/utils/booking'
import { MealDaySelector } from '@/components/booking/MealDaySelector'
import { Button } from '@/components/ui/Button'

interface StepMealsProps {
  data: Partial<BookingFormData>
  duration: number
  onNext: (data: { meals: DayMeal[] }) => void
  onPrev: () => void
}

export function StepMeals({ data, duration, onNext, onPrev }: StepMealsProps) {
  const [meals, setMeals] = useState<DayMeal[]>(() => {
    // Use persisted meals if duration matches, otherwise generate fresh
    if (data.meals && data.meals.length === duration) {
      return data.meals
    }
    return generateDefaultMeals(duration)
  })

  // Regenerate if duration changes (e.g. user navigated back and changed dates)
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
      <div className="text-sm text-gray-500">
        No dates selected. Please go back and select dates.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-600">
        Select meal preferences for each day of your{' '}
        <span className="font-medium text-gray-900">{duration}-night</span> stay.
        Breakfast is included daily.
      </p>

      <div className="space-y-3">
        {meals.map((dayMeal) => (
          <MealDaySelector
            key={dayMeal.day}
            dayMeal={dayMeal}
            onChange={handleDayChange}
          />
        ))}
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="secondary" size="lg" onClick={onPrev}>
          Previous
        </Button>
        <Button type="button" size="lg" onClick={handleSubmit}>
          Next
        </Button>
      </div>
    </div>
  )
}
