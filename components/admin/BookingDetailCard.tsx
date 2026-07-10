'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Booking, BookingStatus, BOOKING_STATUS_LABELS } from '@/lib/types'
import { formatDate, getMealLabel } from '@/lib/utils/booking'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { MealSummary } from '@/components/admin/MealSummary'
import { Button } from '@/components/ui/Button'
import { Label } from '@/components/ui/Label'
import { Select } from '@/components/ui/Select'
import { Card } from '@/components/ui/Card'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils/cn'

interface BookingDetailCardProps {
  booking: Booking
}

const STATUS_OPTIONS = (Object.keys(BOOKING_STATUS_LABELS) as BookingStatus[]).map((key) => ({
  value: key,
  label: BOOKING_STATUS_LABELS[key],
}))

interface DetailRowProps {
  label: string
  value: string | number
  mono?: boolean
}

function DetailRow({ label, value, mono = false }: DetailRowProps) {
  return (
    <div className="flex justify-between items-center py-3.5 border-b border-[#F0EDE9] last:border-0">
      <span className="text-xs font-semibold uppercase tracking-wide text-[#A8A8A8]">{label}</span>
      <span className={cn(
        'text-sm font-medium text-[#1A1A1A]',
        mono && 'font-mono text-[11px] bg-[#F5F3F0] px-2 py-0.5 rounded text-[#737373]'
      )}>
        {value}
      </span>
    </div>
  )
}

export function BookingDetailCard({ booking }: BookingDetailCardProps) {
  const router = useRouter()
  const [status, setStatus] = useState<BookingStatus>(booking.status)
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)

  async function handleStatusUpdate() {
    if (status === booking.status) return
    setIsSaving(true)
    setSaveError(null)
    setSaveSuccess(false)

    const supabase = createClient()
    const { error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', booking.id)

    if (error) {
      setSaveError('Failed to update status. Please try again.')
      setIsSaving(false)
      return
    }

    setSaveSuccess(true)
    setIsSaving(false)
    router.refresh()
  }

  return (
    <div className="space-y-6">
      {/* Booking Info */}
      <Card className="p-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-[#F0EDE9] bg-[#FDFCFA]">
          <p className="text-caption text-[#C9A84C]">Booking Information</p>
        </div>
        <div className="px-6 py-2">
          <DetailRow label="Booking ID"  value={booking.booking_id} mono />
          <DetailRow label="Created"     value={formatDate(booking.created_at)} />
          <div className="flex justify-between items-center py-3.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-[#A8A8A8]">Status</span>
            <StatusBadge status={booking.status} />
          </div>
        </div>
      </Card>

      {/* Guest Info */}
      <Card className="p-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-[#F0EDE9] bg-[#FDFCFA]">
          <p className="text-caption text-[#C9A84C]">Guest</p>
        </div>
        <div className="px-6 py-2">
          <DetailRow label="Name"   value="Unknown User" />
          <DetailRow label="User ID" value={booking.user_id} mono />
        </div>
      </Card>

      {/* Stay Details */}
      <Card className="p-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-[#F0EDE9] bg-[#FDFCFA]">
          <p className="text-caption text-[#C9A84C]">Stay Details</p>
        </div>
        <div className="px-6 py-2">
          <DetailRow label="Check-in"  value={formatDate(booking.check_in)} />
          <DetailRow label="Check-out" value={formatDate(booking.check_out)} />
          <DetailRow label="Duration"  value={`${booking.duration} ${booking.duration === 1 ? 'night' : 'nights'}`} />
          <DetailRow label="Guests"    value={booking.guests} />
        </div>
      </Card>

      {/* Daily Meal Plan */}
      <Card className="p-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-[#F0EDE9] bg-[#FDFCFA]">
          <p className="text-caption text-[#C9A84C]">Daily Meal Plan</p>
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
              {booking.meals.map((meal) => (
                <tr key={meal.day}>
                  <td className="font-medium">Day {meal.day}</td>
                  <td className="text-[#A8A8A8] italic">Included</td>
                  <td>{getMealLabel(meal.lunch)}</td>
                  <td>{getMealLabel(meal.dinner)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Meal Summary */}
      <MealSummary meals={booking.meals} />

      {/* Status Update */}
      <Card className="p-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-[#F0EDE9] bg-[#FDFCFA]">
          <p className="text-caption text-[#C9A84C]">Update Status</p>
        </div>
        <div className="p-6">
          <div className="flex items-end gap-3">
            <div className="flex-1 max-w-xs">
              <Label htmlFor="booking-status">New status</Label>
              <Select
                id="booking-status"
                value={status}
                options={STATUS_OPTIONS}
                onChange={(e) => {
                  setSaveSuccess(false)
                  setStatus(e.target.value as BookingStatus)
                }}
              />
            </div>
            <Button
              onClick={handleStatusUpdate}
              loading={isSaving}
              disabled={status === booking.status}
            >
              Save
            </Button>
          </div>
          {saveError && (
            <p className="mt-3 text-xs text-red-600" role="alert">{saveError}</p>
          )}
          {saveSuccess && (
            <p className="mt-3 text-xs text-[#065F46]">Status updated successfully.</p>
          )}
        </div>
      </Card>
    </div>
  )
}
