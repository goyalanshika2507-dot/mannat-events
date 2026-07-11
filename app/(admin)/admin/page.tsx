import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { BookingTable } from '@/components/admin/BookingTable'
import { Booking } from '@/lib/types'
import { AdminSummaryCards } from '@/components/admin/AdminSummaryCards'
import { AdminSearch } from '@/components/admin/AdminSearch'
import {
  OccupancyAnalytics,
  ActivityTimeline,
} from '@/components/admin/AdminPlaceholders'

export const metadata: Metadata = {
  title: 'Admin — All Bookings',
  description: 'View and manage all event bookings.',
}

interface AdminPageProps {
  searchParams: Promise<{
    status?: string
    bookingId?: string
    email?: string
    from?: string
    to?: string
  }>
}

const STATUS_FILTERS = [
  { value: '', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
]

export default async function AdminPage({
  searchParams,
}: AdminPageProps) {
  const { status, bookingId, email, from, to } =
    await searchParams

  const supabase = await createClient()

  const { data: allBookings } = await supabase
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false })

  const bookings = (allBookings ?? []) as Booking[]

  let pending = 0
  let confirmed = 0
  let completed = 0
  let cancelled = 0

  for (const booking of bookings) {
    if (booking.status === 'pending') pending++
    if (booking.status === 'confirmed') confirmed++
    if (booking.status === 'completed') completed++
    if (booking.status === 'cancelled') cancelled++
  }

  // Today's date in YYYY-MM-DD format
  const today = new Date().toLocaleDateString('en-CA', {
    timeZone: 'Asia/Kolkata',
  })

  // Count bookings whose check-in date is today
  const todaysArrivals = bookings.filter(
    (booking) => booking.check_in === today
  ).length

  let filteredBookings = bookings

  if (status) {
    filteredBookings = filteredBookings.filter(
      (booking) => booking.status === status
    )
  }

  if (bookingId) {
    const value = bookingId.toLowerCase()

    filteredBookings = filteredBookings.filter((booking) =>
      booking.booking_id.toLowerCase().includes(value)
    )
  }

  if (email) {
    const value = email.toLowerCase()

    filteredBookings = filteredBookings.filter((booking) =>
      booking.customer_email
        ?.toLowerCase()
        .includes(value)
    )
  }

  if (from) {
    filteredBookings = filteredBookings.filter(
      (booking) =>
        new Date(booking.created_at) >= new Date(from)
    )
  }

  if (to) {
    const endDate = new Date(to)
    endDate.setHours(23, 59, 59, 999)

    filteredBookings = filteredBookings.filter(
      (booking) =>
        new Date(booking.created_at) <= endDate
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-caption text-[#C9A84C] mb-2">
          Management
        </p>

        <h1 className="text-headline">
          All Bookings
        </h1>

        <p className="mt-2 text-sm text-[#737373]">
          View, filter and manage all customer bookings.
        </p>
      </div>

      <AdminSummaryCards
        total={bookings.length}
        todaysArrivals={todaysArrivals}
        pending={pending}
        confirmed={confirmed}
        completed={completed}
        cancelled={cancelled}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-1 border border-[#E8E5E0] bg-white rounded-[10px] p-1 overflow-x-auto">
              {STATUS_FILTERS.map((filter) => {
                const isActive =
                  (status ?? '') === filter.value

                const params = new URLSearchParams()

                if (filter.value) {
                  params.set('status', filter.value)
                }

                if (bookingId) {
                  params.set('bookingId', bookingId)
                }

                if (email) {
                  params.set('email', email)
                }

                if (from) {
                  params.set('from', from)
                }

                if (to) {
                  params.set('to', to)
                }

                const href = `/admin${
                  params.toString()
                    ? `?${params.toString()}`
                    : ''
                }`

                return (
                  <a
                    key={filter.value}
                    href={href}
                    className={[
                      'px-4 py-2 text-xs font-semibold rounded-[8px] transition-all duration-150 whitespace-nowrap',
                      isActive
                        ? 'bg-[#1A1A1A] text-white shadow-sm'
                        : 'text-[#737373] hover:text-[#1A1A1A] hover:bg-[#F5F3F0]',
                    ].join(' ')}
                  >
                    {filter.label}
                  </a>
                )
              })}
            </div>

            <AdminSearch />
          </div>

          <BookingTable
            bookings={filteredBookings}
          />

          <p className="text-xs text-[#A8A8A8] pb-4">
            Showing {filteredBookings.length} of{' '}
            {bookings.length} bookings
          </p>
        </div>

        <div className="space-y-6 lg:sticky lg:top-24">
          <OccupancyAnalytics />
          <ActivityTimeline />
        </div>
      </div>
    </div>
  )
}