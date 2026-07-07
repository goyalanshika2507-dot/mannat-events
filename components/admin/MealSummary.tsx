import { DayMeal } from '@/lib/types'
import { calculateMealSummary } from '@/lib/utils/meals'

interface MealSummaryProps {
  meals: DayMeal[]
}

interface SummaryRowProps {
  label: string
  value: number
}

function SummaryRow({ label, value }: SummaryRowProps) {
  return (
    <div className="flex justify-between py-1.5 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-600">{label}</span>
      <span className="text-sm font-semibold text-gray-900">{value}</span>
    </div>
  )
}

export function MealSummary({ meals }: MealSummaryProps) {
  const summary = calculateMealSummary(meals)

  return (
    <div>
      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
        Meal Summary
      </h4>
      <div className="border border-gray-200 rounded-lg px-4 divide-y divide-gray-100">
        <SummaryRow label="Veg Lunch"      value={summary.vegLunch} />
        <SummaryRow label="Non-Veg Lunch"  value={summary.nonVegLunch} />
        <SummaryRow label="Veg Dinner"     value={summary.vegDinner} />
        <SummaryRow label="Non-Veg Dinner" value={summary.nonVegDinner} />
        <div className="flex justify-between py-1.5 border-b border-gray-100 last:border-0">
          <span className="text-sm font-medium text-gray-700">Total Lunches</span>
          <span className="text-sm font-semibold text-gray-900">{summary.totalLunch}</span>
        </div>
        <div className="flex justify-between py-1.5">
          <span className="text-sm font-medium text-gray-700">Total Dinners</span>
          <span className="text-sm font-semibold text-gray-900">{summary.totalDinner}</span>
        </div>
      </div>
    </div>
  )
}
