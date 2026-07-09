import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { BookingTable } from '@/components/admin/BookingTable'
import { Booking } from '@/lib/types'
import { AdminSummaryCards } from '@/components/admin/AdminSummaryCards'
import { AdminSearch } from '@/components/admin/AdminSearch'

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

  // Fetch all bookings for summary cards and client-side-like filtering
  const { data: allBookings } = await supabase
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false })

  const bookings = (allBookings ?? []) as Booking[]

  // Calculate summaries
  let pending = 0
  let confirmed = 0
  let completed = 0
  let cancelled = 0

  for (const b of bookings) {
    if (b.status === 'pending') pending++
    if (b.status === 'confirmed') confirmed++
    if (b.status === 'completed') completed++
    if (b.status === 'cancelled') cancelled++
  }

  // Filter local for display
  let filteredBookings = bookings

  if (status) {
    filteredBookings = filteredBookings.filter((b) => b.status === status)
  }

  if (search) {
    const s = search.toLowerCase()
    filteredBookings = filteredBookings.filter((b) => {
      return (
        b.booking_id.toLowerCase().includes(s) ||
        b.user_id.toLowerCase().includes(s)
      )
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-gray-900">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage event bookings and view summaries.
        </p>
      </div>

      <AdminSummaryCards
        total={bookings.length}
        pending={pending}
        confirmed={confirmed}
        completed={completed}
        cancelled={cancelled}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-8 border-b border-gray-200 pb-4">
        {/* Status filter tabs */}
        <div className="flex gap-1 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
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
                  'px-3 py-2 text-sm font-medium border-b-2 -mb-[18px] transition-colors whitespace-nowrap',
                  isActive
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700',
                ].join(' ')}
              >
                {filter.label}
              </a>
            )
          })}
        </div>
        
        <AdminSearch />
      </div>

      <BookingTable bookings={filteredBookings} />
    </div>
  )
}
