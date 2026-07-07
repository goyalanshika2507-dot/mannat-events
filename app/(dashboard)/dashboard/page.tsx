import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader } from '@/components/ui/Card'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { formatDate } from '@/lib/utils/booking'
import { Booking } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Manage your Mannat Events bookings.',
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch user's recent bookings
  const { data: bookings } = await supabase
    .from('bookings')
    .select('*')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your event bookings.
          </p>
        </div>
        <Link href="/booking">
          <Button size="lg">Plan My Stay</Button>
        </Link>
      </div>

      {/* Recent bookings */}
      <Card>
        <CardHeader
          title="Recent Bookings"
          description="Your last 5 submitted bookings."
        />

        {!bookings || bookings.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-gray-200 rounded-lg">
            <p className="text-sm text-gray-500">No bookings yet.</p>
            <p className="mt-1 text-sm text-gray-400">
              Click &ldquo;Plan My Stay&rdquo; to create your first booking.
            </p>
          </div>
        ) : (
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Booking ID</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Check-in</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Check-out</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Guests</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {(bookings as Booking[]).map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-gray-700">
                        {booking.booking_id}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {formatDate(booking.check_in)}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {formatDate(booking.check_out)}
                      </td>
                      <td className="px-4 py-3 text-gray-700">{booking.guests}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={booking.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
