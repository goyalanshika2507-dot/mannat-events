import { DayMeal, MealOption } from '@/lib/types'

interface MealDaySelectorProps {
  dayMeal: DayMeal
  onChange: (updated: DayMeal) => void
}

const MEAL_OPTIONS: { value: MealOption; label: string }[] = [
  { value: 'skip',    label: 'Skip' },
  { value: 'veg',     label: 'Veg' },
  { value: 'non-veg', label: 'Non-Veg' },
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
    <div className="flex items-center gap-3 py-2">
      <span className="w-20 text-sm font-medium text-gray-700 shrink-0">{label}</span>

      {readOnly ? (
        <span className="text-sm text-gray-500 italic">Included</span>
      ) : (
        <div className="flex items-center gap-4" role="group" aria-label={`${name} options`}>
          {MEAL_OPTIONS.map((opt) => (
            <label key={opt.value} className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name={name}
                value={opt.value}
                checked={value === opt.value}
                onChange={() => onChange?.(opt.value)}
                className="accent-gray-900"
              />
              <span className="text-sm text-gray-700">{opt.label}</span>
            </label>
          ))}
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
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* Day header */}
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-2">
        <h4 className="text-sm font-semibold text-gray-800">Day {dayMeal.day}</h4>
      </div>

      {/* Meals */}
      <div className="px-4 divide-y divide-gray-100">
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
