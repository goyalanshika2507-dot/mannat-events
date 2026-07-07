import { DayMeal, MealSummary } from '@/lib/types'

/**
 * Calculates aggregated meal counts from a DayMeal array.
 * Used on the admin booking detail page.
 */
export function calculateMealSummary(meals: DayMeal[]): MealSummary {
  const summary: MealSummary = {
    vegLunch: 0,
    nonVegLunch: 0,
    vegDinner: 0,
    nonVegDinner: 0,
    totalLunch: 0,
    totalDinner: 0,
  }

  for (const meal of meals) {
    if (meal.lunch === 'veg')     summary.vegLunch++
    if (meal.lunch === 'non-veg') summary.nonVegLunch++
    if (meal.dinner === 'veg')    summary.vegDinner++
    if (meal.dinner === 'non-veg') summary.nonVegDinner++
  }

  summary.totalLunch  = summary.vegLunch + summary.nonVegLunch
  summary.totalDinner = summary.vegDinner + summary.nonVegDinner

  return summary
}
