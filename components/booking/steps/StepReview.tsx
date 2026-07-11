import { BookingFormData } from '@/lib/types'
import {
  formatDate,
  getMealLabel,
  calculateDuration,
} from '@/lib/utils/booking'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

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
    <div className="flex justify-between items-center gap-6 py-3.5 border-b border-[#F0EDE9] last:border-0">
      <span className="text-xs font-semibold uppercase tracking-wider text-[#A8A8A8]">
        {label}
      </span>

      <span className="text-sm font-semibold text-[#1A1A1A] text-right">
        {value}
      </span>
    </div>
  )
}

export function StepReview({
  data,
  onSubmit,
  onPrev,
  isSubmitting,
}: StepReviewProps) {
  const duration = calculateDuration(
    data.check_in,
    data.check_out
  )

  return (
    <div className="space-y-8">

      {/* Stay Details */}
      <Card className="p-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-[#F0EDE9] bg-[#FDFCFA]">
          <h4 className="text-caption text-[#C9A84C]">
            Stay Details
          </h4>
        </div>

        <div className="px-6 py-2">
          <ReviewRow
            label="Check-in"
            value={formatDate(data.check_in)}
          />

          <ReviewRow
            label="Check-out"
            value={formatDate(data.check_out)}
          />

          <ReviewRow
            label="Duration"
            value={`${duration} ${
              duration === 1 ? 'night' : 'nights'
            }`}
          />

          <ReviewRow
            label="Guests"
            value={data.guests}
          />
        </div>
      </Card>

      {/* Event Details */}
      <Card className="p-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-[#F0EDE9] bg-[#FDFCFA]">
          <h4 className="text-caption text-[#C9A84C]">
            Event Details
          </h4>
        </div>

        <div className="px-6 py-2">
          <ReviewRow
            label="Event Type"
            value={data.event_type || 'Not selected'}
          />

          <ReviewRow
            label="Decoration Theme"
            value={data.decoration_theme || 'Not selected'}
          />

          <ReviewRow
            label="Theme Colour"
            value={data.theme_colour || 'Not selected'}
          />

          <ReviewRow
            label="Room Category"
            value={data.room_category || 'Not selected'}
          />
        </div>
      </Card>

      {/* Additional Services */}
      <Card className="p-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-[#F0EDE9] bg-[#FDFCFA]">
          <h4 className="text-caption text-[#C9A84C]">
            Additional Services
          </h4>
        </div>

        <div className="px-6 py-2">
          <ReviewRow
            label="Entertainment"
            value={
              data.entertainment?.length
                ? data.entertainment.join(', ')
                : 'None selected'
            }
          />

          <ReviewRow
            label="Photography"
            value={data.photography || 'Not selected'}
          />

          <ReviewRow
            label="Transportation"
            value={data.transportation || 'Not selected'}
          />

          <ReviewRow
            label="Special Requests"
            value={data.special_requests || 'None'}
          />
        </div>
      </Card>

      {/* Meal Plan */}
      <Card className="p-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-[#F0EDE9] bg-[#FDFCFA]">
          <h4 className="text-caption text-[#C9A84C]">
            Custom Cuisines
          </h4>
        </div>

        <div className="overflow-x-auto">
          <table className="luxury-table">
            <thead>
              <tr>
                <th>Day</th>
                <th>Breakfast</th>
                <th>Lunch</th>
                <th>Dinner</th>
              </tr>
            </thead>

            <tbody>
              {data.meals.map((meal) => (
                <tr key={meal.day}>
                  <td className="font-medium">
                    Day {meal.day}
                  </td>

                  <td className="text-[#A8A8A8] italic">
                    Included
                  </td>

                  <td>
                    {getMealLabel(meal.lunch)}
                  </td>

                  <td>
                    {getMealLabel(meal.dinner)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex flex-col-reverse sm:flex-row justify-between gap-4 pt-2">
        <Button
          variant="secondary"
          size="lg"
          onClick={onPrev}
          className="w-full sm:w-auto"
        >
          Previous
        </Button>

        <Button
          size="lg"
          variant="gold"
          loading={isSubmitting}
          onClick={onSubmit}
          className="w-full sm:w-auto"
        >
          Confirm Booking
        </Button>
      </div>

    </div>
  )
}