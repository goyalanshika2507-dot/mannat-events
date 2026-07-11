import Link from 'next/link'
import { Booking } from '@/lib/types'
import { formatDate } from '@/lib/utils/booking'
import { StatusBadge } from '@/components/admin/StatusBadge'

interface BookingTableProps {
  bookings: Booking[]
}

export function BookingTable({ bookings }: BookingTableProps) {
  if (bookings.length === 0) {
    return (
      <div className="text-center py-16 rounded-[14px] border border-dashed border-[#E8E5E0]">
        <p className="text-sm font-medium text-[#1A1A1A]">
          No bookings found
        </p>

        <p className="mt-1 text-sm text-[#A8A8A8]">
          Try adjusting your filters or search query.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-[14px] border border-[#E8E5E0] shadow-[0_2px_12px_rgba(0,0,0,0.05)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="luxury-table">
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Guest UUID</th>
              <th>Customer Email</th>
              <th>Check-in</th>
              <th>Check-out</th>
              <th>Nights</th>
              <th>Guests</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td>
                  <span className="font-mono text-[11px] text-[#737373] bg-[#F5F3F0] px-2 py-0.5 rounded whitespace-nowrap">
                    {booking.booking_id}
                  </span>
                </td>

                <td>
                  <span
                    className="font-mono text-[11px] text-[#A8A8A8] whitespace-nowrap"
                    title={booking.user_id}
                  >
                    {booking.user_id.slice(0, 8)}…
                  </span>
                </td>

                <td>
                  <span className="text-sm text-[#737373] whitespace-nowrap">
                    {booking.customer_email || 'Not available'}
                  </span>
                </td>

                <td className="font-medium whitespace-nowrap">
                  {formatDate(booking.check_in)}
                </td>

                <td className="font-medium whitespace-nowrap">
                  {formatDate(booking.check_out)}
                </td>

                <td className="text-[#737373] whitespace-nowrap">
                  {booking.duration}n
                </td>

                <td className="text-[#737373]">
                  {booking.guests}
                </td>

                <td>
                  <StatusBadge status={booking.status} />
                </td>

                <td>
                  <Link
                    href={`/admin/${booking.id}`}
                    className="text-xs font-semibold text-[#C9A84C] hover:text-[#B8943E] transition-colors underline underline-offset-2 whitespace-nowrap"
                  >
                    View →
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