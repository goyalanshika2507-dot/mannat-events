import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { BookingTable } from '@/components/admin/BookingTable'
import { Booking } from '@/lib/types'
import { AdminSummaryCards } from '@/components/admin/AdminSummaryCards'
import { AdminSearch } from '@/components/admin/AdminSearch'
import { OccupancyAnalytics, ActivityTimeline } from '@/components/admin/AdminPlaceholders'

export const metadata: Metadata = {
  title: 'Admin — All Bookings',
  description: 'View and manage all event bookings.',
}

interface AdminPageProps {
  searchParams: Promise<{ status?: string; search?: string }>
}

const STATUS_FILTERS = [
  { value: '',          label: 'All' },
  { value: 'pending',   label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
]

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const { status, search } = await searchParams
  const supabase = await createClient()

  const { data: allBookings } = await supabase
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false })

  const bookings = (allBookings ?? []) as Booking[]

  let pending = 0, confirmed = 0, completed = 0, cancelled = 0
  for (const b of bookings) {
    if (b.status === 'pending')   pending++
    if (b.status === 'confirmed') confirmed++
    if (b.status === 'completed') completed++
    if (b.status === 'cancelled') cancelled++
  }

  let filteredBookings = bookings
  if (status) filteredBookings = filteredBookings.filter((b) => b.status === status)
  if (search) {
    const s = search.toLowerCase()
    filteredBookings = filteredBookings.filter((b) =>
      b.booking_id.toLowerCase().includes(s) || b.user_id.toLowerCase().includes(s)
    )
  }

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <p className="text-caption text-[#C9A84C] mb-2">Management</p>
        <h1 className="text-headline">All Bookings</h1>
        <p className="mt-2 text-sm text-[#737373]">
          View, filter and manage all customer bookings.
        </p>
      </div>

      {/* Summary cards */}
      <AdminSummaryCards
        total={bookings.length}
        pending={pending}
        confirmed={confirmed}
        completed={completed}
        cancelled={cancelled}
      />

      {/* Two Column Grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Main section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Filters + Search row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
            {/* Status tabs */}
            <div className="flex items-center gap-1 border border-[#E8E5E0] bg-white rounded-[10px] p-1 overflow-x-auto">
              {STATUS_FILTERS.map((filter) => {
                const isActive = (status ?? '') === filter.value
                const params = new URLSearchParams()
                if (filter.value) params.set('status', filter.value)
                if (search) params.set('search', search)
                const href = `/admin${params.toString() ? '?' + params.toString() : ''}`

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

          {/* Table */}
          <BookingTable bookings={filteredBookings} />

          {/* Footer meta */}
          <p className="text-xs text-[#A8A8A8] pb-4">
            Showing {filteredBookings.length} of {bookings.length} bookings
          </p>
        </div>

        {/* Sidebar placeholders */}
        <div className="space-y-6 lg:sticky lg:top-24">
          <OccupancyAnalytics />
          <ActivityTimeline />
        </div>
      </div>
    </div>
  )
}
