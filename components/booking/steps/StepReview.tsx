import { BookingFormData } from '@/lib/types'
import { formatDate, calculateDuration, getBaraatLabel } from '@/lib/utils/booking'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

interface StepReviewProps {
  data: BookingFormData
  onSubmit: () => void
  onPrev: () => void
  isSubmitting: boolean
}

function ReviewRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex justify-between items-start gap-6 py-3.5 border-b border-[#F0EDE9] last:border-0">
      <span className="text-xs font-semibold uppercase tracking-wider text-[#A8A8A8] shrink-0">
        {label}
      </span>
      <span className="text-sm font-semibold text-[#1A1A1A] text-right">
        {value}
      </span>
    </div>
  )
}

export function StepReview({ data, onSubmit, onPrev, isSubmitting }: StepReviewProps) {
  const duration  = calculateDuration(data.check_in, data.check_out)
  const dayPlans  = data.day_plans   ?? []
  const functions = data.functions   ?? []

  return (
    <div className="space-y-6">

      {/* Stay Details */}
      <Card className="p-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-[#F0EDE9] bg-[#FDFCFA]">
          <h4 className="text-caption text-[#C9A84C]">Stay Details</h4>
        </div>
        <div className="px-6 py-2">
          <ReviewRow label="Check-in"  value={formatDate(data.check_in)} />
          <ReviewRow label="Check-out" value={formatDate(data.check_out)} />
          <ReviewRow label="Duration"  value={`${duration} ${duration === 1 ? 'night' : 'nights'}`} />
        </div>
      </Card>

      {/* Day-by-Day Plans */}
      {dayPlans.length > 0 && (
        <Card className="p-0 overflow-hidden">
          <div className="px-6 py-4 border-b border-[#F0EDE9] bg-[#FDFCFA]">
            <h4 className="text-caption text-[#C9A84C]">Daily Meal Plan</h4>
          </div>
          <div className="overflow-x-auto">
            <table className="luxury-table">
              <thead>
                <tr>
                  <th>Day</th>
                  <th>Rooms</th>
                  <th>Breakfast</th>
                  <th>Lunch</th>
                  <th>Dinner</th>
                </tr>
              </thead>
              <tbody>
                {dayPlans.map((plan) => (
                  <tr key={plan.day}>
                    <td className="font-medium">Day {plan.day}</td>
                    <td>{plan.rooms ?? '—'}</td>
                    <td className="text-[#A8A8A8] italic text-sm">Included</td>
                    <td>
                      <span className="block text-sm font-medium capitalize">
                        {plan.lunch?.type ?? '—'}
                      </span>
                      <span className="block text-xs text-[#737373]">
                        {plan.lunch?.guest_count ?? 0} guests
                      </span>
                      {(plan.lunch?.menu_item_names?.length ?? 0) > 0 && (
                        <span className="block text-xs text-[#A8A8A8]">
                          {plan.lunch.menu_item_names.join(', ')}
                        </span>
                      )}
                    </td>
                    <td>
                      <span className="block text-sm font-medium capitalize">
                        {plan.dinner?.type ?? '—'}
                      </span>
                      <span className="block text-xs text-[#737373]">
                        {plan.dinner?.guest_count ?? 0} guests
                      </span>
                      {(plan.dinner?.menu_item_names?.length ?? 0) > 0 && (
                        <span className="block text-xs text-[#A8A8A8]">
                          {plan.dinner.menu_item_names.join(', ')}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Menu Configuration Details */}
      {dayPlans.some(p => p.lunch?.menu_config || p.dinner?.menu_config) && (
        <Card className="p-0 overflow-hidden">
          <div className="px-6 py-4 border-b border-[#F0EDE9] bg-[#FDFCFA]">
            <h4 className="text-caption text-[#C9A84C]">Menu Configuration Details</h4>
          </div>
          <div className="px-6 py-4 space-y-6">
            {dayPlans.map(plan => {
              const lunchConf = plan.lunch?.menu_config
              const dinnerConf = plan.dinner?.menu_config
              if (!lunchConf && !dinnerConf) return null

              return (
                <div key={plan.day} className="space-y-4 border-b border-[#F0EDE9] last:border-0 pb-6 last:pb-0">
                  <h5 className="font-serif font-bold text-[#1A1A1A]">Day {plan.day}</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Lunch */}
                    {lunchConf && (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center bg-green-50/50 p-2 rounded-lg border border-green-100">
                          <span className="text-xs font-bold text-green-700 uppercase">Lunch: {lunchConf.packageName}</span>
                          <span className="text-xs font-bold text-[#C5A85C]">₹{lunchConf.pricePerHead}/head</span>
                        </div>
                        <div className="text-xs space-y-2 text-[#737373] pl-2">
                          {lunchConf.selections.map(sel => {
                            if (sel.items.length === 0) return null
                            return (
                              <div key={sel.categoryId}>
                                <strong className="text-[#1A1A1A] block">{sel.categoryId.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}:</strong>
                                <span>{sel.items.join(', ')}</span>
                              </div>
                            )
                          })}
                          {lunchConf.liveStations && lunchConf.liveStations.length > 0 && (
                            <div>
                              <strong className="text-[#1A1A1A] block">Live Stations:</strong>
                              <span>{lunchConf.liveStations.join(', ')}</span>
                            </div>
                          )}
                          {lunchConf.addOns && lunchConf.addOns.length > 0 && (
                            <div>
                              <strong className="text-[#907030] block">Add-ons:</strong>
                              <span>{lunchConf.addOns.join(', ')}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Dinner */}
                    {dinnerConf && (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center bg-red-50/50 p-2 rounded-lg border border-red-100">
                          <span className="text-xs font-bold text-red-700 uppercase">Dinner: {dinnerConf.packageName}</span>
                          <span className="text-xs font-bold text-[#C5A85C]">₹{dinnerConf.pricePerHead}/head</span>
                        </div>
                        <div className="text-xs space-y-2 text-[#737373] pl-2">
                          {dinnerConf.selections.map(sel => {
                            if (sel.items.length === 0) return null
                            return (
                              <div key={sel.categoryId}>
                                <strong className="text-[#1A1A1A] block">{sel.categoryId.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}:</strong>
                                <span>{sel.items.join(', ')}</span>
                              </div>
                            )
                          })}
                          {dinnerConf.liveStations && dinnerConf.liveStations.length > 0 && (
                            <div>
                              <strong className="text-[#1A1A1A] block">Live Stations:</strong>
                              <span>{dinnerConf.liveStations.join(', ')}</span>
                            </div>
                          )}
                          {dinnerConf.addOns && dinnerConf.addOns.length > 0 && (
                            <div>
                              <strong className="text-[#907030] block">Add-ons:</strong>
                              <span>{dinnerConf.addOns.join(', ')}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      )}

      {/* Wedding Functions — only if assigned */}
      {functions.length > 0 && (
        <Card className="p-0 overflow-hidden">
          <div className="px-6 py-4 border-b border-[#F0EDE9] bg-[#FDFCFA]">
            <h4 className="text-caption text-[#C9A84C]">Wedding Functions</h4>
          </div>
          <div className="px-6 py-4 flex flex-wrap gap-2">
            {functions.map((fn) => (
              <span
                key={fn.function_id}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F5EDD6] border border-[#E8D9A8] text-xs font-medium text-[#1A1A1A]"
              >
                {fn.function_name}
                <span className="text-[#A08040]">→ Day {fn.day}</span>
              </span>
            ))}
          </div>
        </Card>
      )}

      {/* Event Style */}
      <Card className="p-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-[#F0EDE9] bg-[#FDFCFA]">
          <h4 className="text-caption text-[#C9A84C]">Event Style</h4>
        </div>
        <div className="px-6 py-2">
          {data.decoration_theme_title && (
            <ReviewRow label="Decoration Theme" value={data.decoration_theme_title} />
          )}
          <ReviewRow
            label="Baraat Style"
            value={data.baraat_style ? getBaraatLabel(data.baraat_style) : 'Not selected'}
          />
        </div>
      </Card>

      {/* Admin note */}
      <div className="rounded-2xl border border-[#E8D9A8] bg-[#FDFAF3] px-5 py-4">
        <p className="text-xs text-[#A08040] font-medium leading-relaxed">
          📋 Your booking request will be reviewed by our team. A personalised quotation will be prepared and sent to you within 24 hours.
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col-reverse sm:flex-row justify-between gap-4 pt-2">
        <Button variant="secondary" size="lg" onClick={onPrev} className="w-full sm:w-auto">
          Previous
        </Button>
        <Button
          size="lg"
          variant="gold"
          loading={isSubmitting}
          onClick={onSubmit}
          className="w-full sm:w-auto"
        >
          Confirm Booking Request
        </Button>
      </div>
    </div>
  )
}