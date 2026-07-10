import { DayMeal } from '@/lib/types'
import { calculateMealSummary } from '@/lib/utils/meals'
import { Card } from '@/components/ui/Card'

interface MealSummaryProps {
  meals: DayMeal[]
}

interface SummaryRowProps {
  label: string
  value: number
  highlight?: boolean
}

function SummaryRow({ label, value, highlight = false }: SummaryRowProps) {
  return (
    <div className="flex justify-between items-center py-3 border-b border-[#F0EDE9] last:border-0">
      <span className={highlight ? 'text-xs font-semibold text-[#1A1A1A]' : 'text-xs text-[#737373]'}>
        {label}
      </span>
      <span className={highlight ? 'text-sm font-bold text-[#1A1A1A]' : 'text-sm font-semibold text-[#1A1A1A]'}>
        {value}
      </span>
    </div>
  )
}

export function MealSummary({ meals }: MealSummaryProps) {
  const summary = calculateMealSummary(meals)

  return (
    <Card className="p-0 overflow-hidden">
      <div className="px-6 py-4 border-b border-[#F0EDE9] bg-[#FDFCFA]">
        <p className="text-caption text-[#C9A84C]">Meal Summary</p>
      </div>
      <div className="px-6 py-2">
        <SummaryRow label="Veg Lunch"        value={summary.vegLunch} />
        <SummaryRow label="Non-Veg Lunch"    value={summary.nonVegLunch} />
        <SummaryRow label="Veg Dinner"       value={summary.vegDinner} />
        <SummaryRow label="Non-Veg Dinner"   value={summary.nonVegDinner} />
        <SummaryRow label="Total Lunches"    value={summary.totalLunch}  highlight />
        <SummaryRow label="Total Dinners"    value={summary.totalDinner} highlight />
      </div>
    </Card>
  )
}
