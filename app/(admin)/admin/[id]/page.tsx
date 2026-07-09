import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Booking } from '@/lib/types'
import { BookingDetailCard } from '@/components/admin/BookingDetailCard'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'Booking Detail',
  description: 'View and manage a specific booking.',
}

interface AdminBookingDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function AdminBookingDetailPage({
  params,
}: AdminBookingDetailPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: booking, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !booking) notFound()

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin">
          <Button variant="ghost" size="sm">
            &larr; Back to Bookings
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="text-lg font-semibold text-gray-900">Booking Detail</h1>
        <p className="mt-1 text-sm text-gray-500 font-mono">{booking.booking_id}</p>
      </div>

      <BookingDetailCard booking={booking as Booking} />
    </div>
  )
}
