import { BookingFormData } from '@/lib/types'
import { formatDate, getMealLabel, calculateDuration } from '@/lib/utils/booking'
import { Button } from '@/components/ui/Button'

interface StepReviewProps {
  data: BookingFormData
  onSubmit: () => void
  onPrev: () => void
  isSubmitting: boolean
}

interface ReviewRowProps {
  label: string
  value: string | number
}

function ReviewRow({ label, value }: ReviewRowProps) {
  return (
    <div className="flex justify-between py-2 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-600">{label}</span>
      <span className="text-sm font-medium text-gray-900">{value}</span>
    </div>
  )
}

export function StepReview({ data, onSubmit, onPrev, isSubmitting }: StepReviewProps) {
  const duration = calculateDuration(data.check_in, data.check_out)

  return (
    <div className="space-y-6">
      {/* Stay details */}
      <section>
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Stay Details
        </h3>
        <div className="border border-gray-200 rounded-lg px-4 divide-y divide-gray-100">
          <ReviewRow label="Check-in"  value={formatDate(data.check_in)} />
          <ReviewRow label="Check-out" value={formatDate(data.check_out)} />
          <ReviewRow label="Duration"  value={`${duration} ${duration === 1 ? 'night' : 'nights'}`} />
          <ReviewRow label="Guests"    value={data.guests} />
        </div>
      </section>

      {/* Meal plan */}
      <section>
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Meal Plan
        </h3>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-4 bg-gray-50 border-b border-gray-200 px-4 py-2">
            <span className="text-xs font-semibold text-gray-600">Day</span>
            <span className="text-xs font-semibold text-gray-600">Breakfast</span>
            <span className="text-xs font-semibold text-gray-600">Lunch</span>
            <span className="text-xs font-semibold text-gray-600">Dinner</span>
          </div>
          {/* Table rows */}
          {data.meals.map((meal) => (
            <div
              key={meal.day}
              className="grid grid-cols-4 px-4 py-2 border-b border-gray-100 last:border-0"
            >
              <span className="text-sm text-gray-700">Day {meal.day}</span>
              <span className="text-sm text-gray-500 italic">Included</span>
              <span className="text-sm text-gray-900">{getMealLabel(meal.lunch)}</span>
              <span className="text-sm text-gray-900">{getMealLabel(meal.dinner)}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Actions */}
      <div className="flex justify-between">
        <Button type="button" variant="secondary" size="lg" onClick={onPrev}>
          Previous
        </Button>
        <Button
          type="button"
          size="lg"
          loading={isSubmitting}
          onClick={onSubmit}
        >
          Confirm Booking
        </Button>
      </div>
    </div>
  )
}
