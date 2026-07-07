import Link from 'next/link'
import { BookingWithProfile } from '@/lib/types'
import { formatDate } from '@/lib/utils/booking'
import { StatusBadge } from '@/components/admin/StatusBadge'

interface BookingTableProps {
  bookings: BookingWithProfile[]
}

export function BookingTable({ bookings }: BookingTableProps) {
  if (bookings.length === 0) {
    return (
      <div className="border border-gray-200 rounded-lg px-6 py-12 text-center">
        <p className="text-sm text-gray-500">No bookings found.</p>
      </div>
    )
  }

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">Booking ID</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">Guest</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">Check-in</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">Check-out</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">Nights</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">Guests</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">Status</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {bookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-mono text-xs text-gray-700 whitespace-nowrap">
                  {booking.booking_id}
                </td>
                <td className="px-4 py-3 text-gray-900 whitespace-nowrap">
                  <div>{booking.profiles?.full_name ?? '—'}</div>
                  <div className="text-xs text-gray-500">{booking.profiles?.email}</div>
                </td>
                <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                  {formatDate(booking.check_in)}
                </td>
                <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                  {formatDate(booking.check_out)}
                </td>
                <td className="px-4 py-3 text-gray-700">{booking.duration}</td>
                <td className="px-4 py-3 text-gray-700">{booking.guests}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={booking.status} />
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/${booking.id}`}
                    className="text-gray-900 font-medium underline underline-offset-2 hover:text-gray-600 transition-colors text-xs"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
