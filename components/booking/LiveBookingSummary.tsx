import { BookingFormData } from '@/lib/types'
import { calculateDuration } from '@/lib/utils/booking'
import { Card } from '@/components/ui/Card'

interface LiveBookingSummaryProps {
  data: Partial<BookingFormData>
}

function SummaryRow({
  label,
  value,
}: {
  label: string
  value?: string | number
}) {
  if (value === undefined || value === null || value === '') return null

  return (
    <div className="flex justify-between gap-4 py-3 border-b border-[#F0EDE9] last:border-0">
      <span className="text-xs text-[#A8A8A8] uppercase tracking-wide">
        {label}
      </span>

      <span className="text-sm font-medium text-[#1A1A1A] text-right">
        {value}
      </span>
    </div>
  )
}

export function LiveBookingSummary({
  data,
}: LiveBookingSummaryProps) {
  const duration =
    data.check_in && data.check_out
      ? calculateDuration(data.check_in, data.check_out)
      : 0

  const hasData = Object.keys(data).length > 0

  return (
    <Card className="p-0 overflow-hidden">
      <div className="px-6 py-5 border-b border-[#F0EDE9] bg-[#FDFCFA]">
        <p className="text-xs uppercase tracking-[0.18em] text-[#C9A84C] font-semibold">
          Your Booking
        </p>

        <h3 className="mt-1 text-xl font-medium text-[#1A1A1A]">
          Live Summary
        </h3>
      </div>

      <div className="px-6 py-2">
        {!hasData && (
          <p className="py-6 text-sm text-[#A8A8A8]">
            Your selections will appear here as you plan your event.
          </p>
        )}

        <SummaryRow label="Check-in" value={data.check_in} />
        <SummaryRow label="Check-out" value={data.check_out} />

        {duration > 0 && (
          <SummaryRow
            label="Duration"
            value={`${duration} ${duration === 1 ? 'night' : 'nights'}`}
          />
        )}

        <SummaryRow label="Guests" value={data.guests} />
        <SummaryRow label="Event" value={data.event_type} />
        <SummaryRow
          label="Decoration"
          value={data.decoration_theme}
        />
        <SummaryRow
          label="Theme Colour"
          value={data.theme_colour}
        />
        <SummaryRow
          label="Room"
          value={data.room_category}
        />

        {data.entertainment &&
          data.entertainment.length > 0 && (
            <SummaryRow
              label="Entertainment"
              value={data.entertainment.join(', ')}
            />
          )}

        <SummaryRow
          label="Photography"
          value={data.photography}
        />

        <SummaryRow
          label="Transport"
          value={data.transportation}
        />

        {data.meals && (
          <SummaryRow
            label="Meal Days"
            value={data.meals.length}
          />
        )}

        <SummaryRow
          label="Requests"
          value={data.special_requests}
        />
      </div>
    </Card>
  )
}