import { BookingFormData } from '@/lib/types'
import { calculateDuration } from '@/lib/utils/booking'
import { Info } from 'lucide-react'

interface LiveBookingSummaryProps {
  data: Partial<BookingFormData>
}
function SummaryRow({
  label,
  
  value,
}: {
  label: string
  value?: string | number | null
}) {
  if (value === undefined || value === null || value === '') return null
  return (
    <div className="py-3.5 border-b border-[#EEEAE4] last:border-0">
      <p className="text-[11px] font-semibold text-[#A08D62] uppercase tracking-[0.14em] mb-1">
        {label}
      </p>
      <p className="text-[14px] font-medium leading-relaxed text-[#1A1A1A] break-words">
        {value}
      </p>
    </div>
  )
}

export function LiveBookingSummary({ data }: LiveBookingSummaryProps) {
  const duration =
    data.check_in && data.check_out
      ? calculateDuration(data.check_in, data.check_out)
      : 0

  const hasData = Object.keys(data).some((k) => {
    const v = (data as Record<string, unknown>)[k]
    if (Array.isArray(v)) return v.length > 0
    return v !== undefined && v !== null && v !== ''
  })

  return (
    <div className="space-y-4">
      {/* Live Summary Panel */}
      <div className="glass-panel rounded-2xl overflow-hidden shadow-3d bg-white border border-[#E8E2D8]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#EEEAE4] bg-gradient-to-r from-[#FDFCFA] to-[#FAF6EE]">
          <p className="text-[10px] uppercase tracking-[0.22em] text-[#C5A85C] font-bold mb-1">
            Your Wedding Folio
          </p>
          <h3 className="text-lg font-serif font-medium text-[#1A1A1A]">
            Live Summary
          </h3>
          <p className="mt-1 text-xs leading-relaxed text-[#737373]">
            Updates in real-time as you customize.
          </p>
        </div>

        {/* Body */}
        <div className="px-6 py-2 max-h-[calc(100vh-280px)] overflow-y-auto">
          {!hasData && (
            <p className="py-8 text-sm leading-relaxed text-[#8A8A8A] text-center">
              Your selections will appear here as you plan your event.
            </p>
          )}

          <SummaryRow label="Check-in" value={data.check_in} />
          <SummaryRow label="Check-out" value={data.check_out} />

          {duration > 0 && (
            <SummaryRow
              label="Duration"
              value={`${duration} ${duration === 1 ? 'day event' : 'days event'}`}
            />
          )}

          {/* Day plans summary */}
          {data.day_plans && data.day_plans.length > 0 && (
            <div className="py-3.5 border-b border-[#EEEAE4]">
              <p className="text-[11px] font-semibold text-[#A08D62] uppercase tracking-[0.14em] mb-2">
                Day-by-Day Setup
              </p>
              <div className="space-y-3">
                {data.day_plans.map((plan) => (
                  <div key={plan.day} className="text-[12px] text-[#1A1A1A] bg-[#FDFCFA] p-2.5 rounded-xl border border-[#F0EDE9] space-y-1">
                    <div className="flex justify-between font-bold text-[#C5A85C]">
                      <span>Day {plan.day}</span>
                      <span>{plan.rooms ?? 1} Rooms · {plan.guest_count ?? 50} Guests</span>
                    </div>
                    <div className="text-[11px] text-[#737373]">
                      <span className="font-semibold text-[#1A1A1A]">Lunch:</span> {plan.lunch_function ?? 'Welcome Lunch'}
                    </div>
                    <div className="text-[11px] text-[#737373]">
                      <span className="font-semibold text-[#1A1A1A]">Dinner:</span> {plan.dinner_function ?? 'Welcome Dinner'}
                    </div>
                    <div className="text-[10px] uppercase font-bold text-[#A08040] pt-0.5">
                      Food Pref: {plan.food_preference ?? 'Veg'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.decoration_package && (
            <SummaryRow label="Decor Tier" value={`${data.decoration_package.toUpperCase()} Package`} />
          )}

          {data.selected_hotel && (
            <SummaryRow label="Selected Venue" value={`${data.selected_hotel.name} (${data.selected_hotel.price_display})`} />
          )}
        </div>
      </div>

      {/* Menu Customization Note below Live Summary */}
      <div className="rounded-2xl border border-[#E8D9A8] bg-[#FDFAF3] p-4 flex items-start gap-3 shadow-xs">
        <Info size={18} className="text-[#C5A85C] shrink-0 mt-0.5" />
        <p className="text-xs text-[#907030] leading-relaxed">
          Please feel free to amend or alter the menus as per your requirements. Don&apos;t worry about High Tea—it can always be added later.
        </p>
      </div>
    </div>
  )
}