import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { BookingTable } from '@/components/admin/BookingTable'
import { BookingWithProfile } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Admin — All Bookings',
  description: 'View and manage all event bookings.',
}

interface AdminPageProps {
  searchParams: Promise<{ status?: string }>
}

const STATUS_FILTERS = [
  { value: '',          label: 'All' },
  { value: 'pending',   label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
]

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const { status } = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('bookings')
    .select(`
      *,
      profiles (
        email,
        full_name
      )
    `)
    .order('created_at', { ascending: false })

  if (status) {
    query = query.eq('status', status)
  }

  const { data: bookings } = await query

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-gray-900">All Bookings</h1>
        <p className="mt-1 text-sm text-gray-500">
          {bookings?.length ?? 0} booking{bookings?.length !== 1 ? 's' : ''}
          {status ? ` with status "${status}"` : ' total'}
        </p>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-1 border-b border-gray-200">
        {STATUS_FILTERS.map((filter) => {
          const isActive = (status ?? '') === filter.value
          return (
            <a
              key={filter.value}
              href={filter.value ? `/admin?status=${filter.value}` : '/admin'}
              className={[
                'px-3 py-2 text-sm font-medium border-b-2 -mb-px transition-colors',
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

      <BookingTable bookings={(bookings ?? []) as BookingWithProfile[]} />
    </div>
  )
}
