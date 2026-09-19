import type { Metadata } from 'next'
import { createServiceClient } from '@/lib/supabase/server'
import { Booking } from '@/lib/types'
import { AdminBookingsClient } from '@/components/admin/AdminBookingsClient'

export const metadata: Metadata = {
  title: 'Bookings Management — Admin Panel',
  description: 'View and manage all customer event bookings.',
}

interface BookingsPageProps {
  searchParams: Promise<{
    status?: string
    search?: string
  }>
}

export default async function AdminBookingsPage({ searchParams }: BookingsPageProps) {
  const { status, search } = await searchParams
  const supabase = createServiceClient()

  const { data: allBookings } = await supabase
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false })

  const bookings = (allBookings ?? []) as Booking[]

  return (
    <div className="space-y-8">
      <div>
        <span className="px-3 py-1 rounded-full bg-[#C5A85C]/20 border border-[#C5A85C]/40 text-[#C5A85C] text-[10px] font-bold tracking-widest uppercase inline-block mb-2">
          CUSTOMER ENQUIRIES & BOOKINGS
        </span>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-wide">
          Bookings Management
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-[#A1A1AA] max-w-2xl leading-relaxed">
          Manage all incoming customer event reservations. Review details, update booking statuses, and manage guest enquiries.
        </p>
      </div>

      <AdminBookingsClient
        initialBookings={bookings}
        initialStatus={status || ''}
        initialSearch={search || ''}
      />
    </div>
  )
}
