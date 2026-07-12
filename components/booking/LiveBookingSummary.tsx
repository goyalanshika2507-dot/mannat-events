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
    <div className="py-4 border-b border-[#EEEAE4] last:border-0">
      <p className="text-[11px] font-semibold text-[#A08D62] uppercase tracking-[0.14em] mb-1.5">
        {label}
      </p>

      <p className="text-[15px] font-medium leading-relaxed text-[#1A1A1A] break-words">
        {value}
      </p>
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
    <Card className="p-0 overflow-hidden rounded-2xl border border-[#E8E2D8] shadow-sm bg-white">
      {/* Header */}
      <div className="px-7 py-6 border-b border-[#EEEAE4] bg-[#FDFCFA]">
        <p className="text-[11px] uppercase tracking-[0.2em] text-[#C5A85C] font-semibold">
          Your Booking
        </p>

        <h3 className="mt-2 text-2xl font-serif font-medium text-[#1A1A1A]">
          Live Summary
        </h3>

        <p className="mt-2 text-sm leading-relaxed text-[#737373]">
          Your selections update automatically as you complete each step.
        </p>
      </div>

      {/* Summary Content */}
      <div className="px-7 py-2 max-h-[calc(100vh-180px)] overflow-y-auto">
        {!hasData && (
          <p className="py-8 text-[15px] leading-relaxed text-[#8A8A8A]">
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
        <SummaryRow label="Decoration" value={data.decoration_theme} />
        <SummaryRow label="Theme Colour" value={data.theme_colour} />
        <SummaryRow label="Room" value={data.room_category} />

        {data.entertainment && data.entertainment.length > 0 && (
          <SummaryRow
            label="Entertainment"
            value={data.entertainment.join(', ')}
          />
        )}

        <SummaryRow label="Photography" value={data.photography} />
        <SummaryRow label="Transport" value={data.transportation} />

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