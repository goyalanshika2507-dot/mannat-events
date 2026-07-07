import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Booking } from '@/lib/types'
import { formatDate } from '@/lib/utils/booking'
import { Card } from '@/components/ui/Card'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'Booking Confirmed',
  description: 'Your booking has been submitted successfully.',
}

interface ConfirmationPageProps {
  searchParams: Promise<{ id?: string }>
}

export default async function ConfirmationPage({ searchParams }: ConfirmationPageProps) {
  const { id: bookingId } = await searchParams

  if (!bookingId) notFound()

  const supabase = await createClient()
  const { data: booking, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('booking_id', bookingId)
    .single()

  if (error || !booking) notFound()

  const b = booking as Booking

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-gray-900">Booking Submitted</h1>
        <p className="mt-1 text-sm text-gray-500">
          Your booking has been received and is pending confirmation.
        </p>
      </div>

      <Card>
        <div className="space-y-4">
          {/* Booking ID */}
          <div className="pb-4 border-b border-gray-100">
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">
              Booking ID
            </p>
            <p className="text-lg font-mono font-semibold text-gray-900">{b.booking_id}</p>
          </div>

          {/* Status */}
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">Status</span>
            <StatusBadge status={b.status} />
          </div>

          {/* Dates */}
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">Check-in</span>
            <span className="text-sm font-medium text-gray-900">{formatDate(b.check_in)}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">Check-out</span>
            <span className="text-sm font-medium text-gray-900">{formatDate(b.check_out)}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">Duration</span>
            <span className="text-sm font-medium text-gray-900">
              {b.duration} {b.duration === 1 ? 'night' : 'nights'}
            </span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-sm text-gray-600">Guests</span>
            <span className="text-sm font-medium text-gray-900">{b.guests}</span>
          </div>
        </div>
      </Card>

      <div className="flex gap-3">
        <Link href="/dashboard">
          <Button variant="secondary">Back to Dashboard</Button>
        </Link>
        <Link href="/booking">
          <Button>New Booking</Button>
        </Link>
      </div>
    </div>
  )
}
