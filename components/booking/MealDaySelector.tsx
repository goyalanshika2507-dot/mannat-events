import { DayMeal, MealOption } from '@/lib/types'
import { cn } from '@/lib/utils/cn'

interface MealDaySelectorProps {
  dayMeal: DayMeal
  onChange: (updated: DayMeal) => void
}

const MEAL_OPTIONS: { value: MealOption; label: string }[] = [
  { value: 'skip',    label: 'Skip' },
  { value: 'veg',     label: 'Vegetarian' },
  { value: 'non-veg', label: 'Non-Vegetarian' },
]

interface MealRowProps {
  label: string
  value: MealOption
  readOnly?: boolean
  name: string
  onChange?: (value: MealOption) => void
}

function MealRow({ label, value, readOnly, name, onChange }: MealRowProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between py-4 gap-3">
      <span className="text-xs font-semibold uppercase tracking-wider text-[#737373]">{label}</span>

      {readOnly ? (
        <span className="text-xs font-medium text-[#C9A84C] bg-[#F5EDD6] px-3 py-1 rounded-full uppercase tracking-wider">
          Included
        </span>
      ) : (
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label={`${name} options`}>
          {MEAL_OPTIONS.map((opt) => {
            const isSelected = value === opt.value
            return (
              <label
                key={opt.value}
                className={cn(
                  'flex items-center gap-2 cursor-pointer border px-4 py-2 rounded-full text-xs font-semibold select-none transition-all duration-200',
                  isSelected
                    ? 'bg-[#1A1A1A] border-[#1A1A1A] text-white shadow-sm'
                    : 'bg-white border-[#E8E5E0] text-[#737373] hover:border-[#D4CFC9] hover:text-[#1A1A1A]'
                )}
              >
                <input
                  type="radio"
                  name={name}
                  value={opt.value}
                  checked={isSelected}
                  onChange={() => onChange?.(opt.value)}
                  className="sr-only" // Hidden radio, styled wrapper instead
                />
                {opt.label}
              </label>
            )
          })}
        </div>
      )}
    </div>
  )
}

export function MealDaySelector({ dayMeal, onChange }: MealDaySelectorProps) {
  function handleLunchChange(value: MealOption) {
    onChange({ ...dayMeal, lunch: value })
  }

  function handleDinnerChange(value: MealOption) {
    onChange({ ...dayMeal, dinner: value })
  }

  return (
    <div className="border border-[#E8E5E0] rounded-[14px] bg-white overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
      {/* Day header */}
      <div className="bg-[#FAF8F5] border-b border-[#E8E5E0] px-6 py-4 flex items-center justify-between">
        <h4 className="text-sm font-semibold tracking-tight text-[#1A1A1A]">Day {dayMeal.day}</h4>
        <span className="text-caption text-[#A8A8A8] text-[10px]">Cuisine Selection</span>
      </div>

      {/* Meals */}
      <div className="px-6 py-2 divide-y divide-[#F0EDE9]">
        <MealRow
          label="Breakfast"
          value="veg"
          readOnly
          name={`day-${dayMeal.day}-breakfast`}
        />
        <MealRow
          label="Lunch"
          value={dayMeal.lunch}
          name={`day-${dayMeal.day}-lunch`}
          onChange={handleLunchChange}
        />
        <MealRow
          label="Dinner"
          value={dayMeal.dinner}
          name={`day-${dayMeal.day}-dinner`}
          onChange={handleDinnerChange}
        />
      </div>
    </div>
  )
}
