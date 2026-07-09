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
import { createClient } from '@/lib/supabase/client'

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
}

function DetailRow({ label, value }: DetailRowProps) {
  return (
    <div className="flex justify-between py-2 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-600">{label}</span>
      <span className="text-sm font-medium text-gray-900">{value}</span>
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
      <section>
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Booking Information
        </h3>
        <div className="border border-gray-200 rounded-lg px-4 divide-y divide-gray-100">
          <DetailRow label="Booking ID"  value={booking.booking_id} />
          <DetailRow label="Created"     value={formatDate(booking.created_at)} />
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">Status</span>
            <StatusBadge status={booking.status} />
          </div>
        </div>
      </section>

      {/* Guest Info */}
      <section>
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Guest
        </h3>
        <div className="border border-gray-200 rounded-lg px-4 divide-y divide-gray-100">
          <DetailRow label="Name"   value="Unknown User" />
          <DetailRow label="UUID"   value={booking.user_id} />
        </div>
      </section>

      {/* Stay Details */}
      <section>
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Stay Details
        </h3>
        <div className="border border-gray-200 rounded-lg px-4 divide-y divide-gray-100">
          <DetailRow label="Check-in"  value={formatDate(booking.check_in)} />
          <DetailRow label="Check-out" value={formatDate(booking.check_out)} />
          <DetailRow label="Duration"  value={`${booking.duration} ${booking.duration === 1 ? 'night' : 'nights'}`} />
          <DetailRow label="Guests"    value={booking.guests} />
        </div>
      </section>

      {/* Daily Meal Plan */}
      <section>
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Daily Meal Plan
        </h3>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="grid grid-cols-4 bg-gray-50 border-b border-gray-200 px-4 py-2">
            <span className="text-xs font-semibold text-gray-600">Day</span>
            <span className="text-xs font-semibold text-gray-600">Breakfast</span>
            <span className="text-xs font-semibold text-gray-600">Lunch</span>
            <span className="text-xs font-semibold text-gray-600">Dinner</span>
          </div>
          {booking.meals.map((meal) => (
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

      {/* Meal Summary */}
      <MealSummary meals={booking.meals} />

      {/* Status Update */}
      <section>
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Update Status
        </h3>
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
            size="md"
          >
            Save
          </Button>
        </div>
        {saveError && (
          <p className="mt-2 text-sm text-red-600" role="alert">{saveError}</p>
        )}
        {saveSuccess && (
          <p className="mt-2 text-sm text-green-700">Status updated successfully.</p>
        )}
      </section>
    </div>
  )
}
