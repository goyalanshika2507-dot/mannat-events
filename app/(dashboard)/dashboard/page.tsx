import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/Shared'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { formatDate } from '@/lib/utils/booking'
import { Booking } from '@/lib/types'
import { CalendarDays } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Manage your Mannat Events bookings.',
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: bookings } = await supabase
    .from('bookings')
    .select('*')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })
    .limit(5)

  const totalBookings = bookings?.length ?? 0

  return (
    <div className="space-y-10">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-caption text-[#C9A84C] mb-2">Your workspace</p>
          <h1 className="text-headline">Dashboard</h1>
          <p className="mt-2 text-sm text-[#737373]">
            {totalBookings === 0
              ? 'You have no bookings yet.'
              : `You have ${totalBookings} booking${totalBookings > 1 ? 's' : ''} on record.`}
          </p>
        </div>
        <Link href="/booking">
          <Button size="lg">Plan My Stay</Button>
        </Link>
      </div>

      {/* Bookings card */}
      <Card className="p-0 overflow-hidden">
        <div className="px-8 py-5 border-b border-[#F0EDE9]">
          <CardHeader
            title="Recent Bookings"
            description="Your last 5 submitted bookings."
          />
        </div>

        {!bookings || bookings.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={<CalendarDays size={40} />}
              title="No bookings yet"
              description="Click &ldquo;Plan My Stay&rdquo; to create your first event booking."
              action={
                <Link href="/booking">
                  <Button variant="secondary">Plan My Stay</Button>
                </Link>
              }
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="luxury-table">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Check-in</th>
                  <th>Check-out</th>
                  <th>Guests</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {(bookings as Booking[]).map((booking) => (
                  <tr key={booking.id}>
                    <td>
                      <span className="font-mono text-[11px] text-[#737373] bg-[#F5F3F0] px-2 py-0.5 rounded">
                        {booking.booking_id}
                      </span>
                    </td>
                    <td className="font-medium">{formatDate(booking.check_in)}</td>
                    <td className="font-medium">{formatDate(booking.check_out)}</td>
                    <td className="text-[#737373]">{booking.guests}</td>
                    <td>
                      <StatusBadge status={booking.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}
