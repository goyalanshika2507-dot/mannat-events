import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/Shared'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { formatDate } from '@/lib/utils/booking'
import { Booking } from '@/lib/types'
import {
  CalendarDays,
  ArrowRight,
  BookOpen,
  UserRound,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Manage your Mannat Events bookings.',
}

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: bookings } = await supabase
    .from('bookings')
    .select('*')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })
    .limit(5)

  const totalBookings = bookings?.length ?? 0

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user!.id)
    .single()

  const firstName =
    profile?.full_name?.trim().split(' ')[0] ||
    user?.email?.split('@')[0] ||
    'Guest'

  const hour = new Date().getHours()

  const greeting =
    hour < 12
      ? 'Good Morning'
      : hour < 17
        ? 'Good Afternoon'
        : 'Good Evening'

  return (
    <div className="space-y-16">
      {/* Welcome Section */}
      <section className="flex flex-col gap-8 border-b border-[#E8E5E0] pb-12 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-caption">
            {greeting}, {firstName}
          </p>

          <h1 className="mt-4 text-headline">
            Welcome Back
          </h1>

          <p className="mt-5 max-w-xl text-lg leading-8 text-[#737373]">
            Plan your next stay, review your previous bookings
            and manage everything from one place.
          </p>

          <p className="mt-5 text-base font-medium text-[#1A1A1A]">
            {totalBookings === 0
              ? 'You have no bookings yet.'
              : `You have ${totalBookings} booking${
                  totalBookings > 1 ? 's' : ''
                } on record.`}
          </p>
        </div>

        <Link href="/booking" className="w-full sm:w-auto">
          <Button
            size="lg"
            className="flex w-full items-center justify-center gap-2 sm:w-auto"
          >
            Plan My Stay
            <ArrowRight size={17} />
          </Button>
        </Link>
      </section>

      {/* Quick Actions */}
      <section>
        <div className="mb-8">
          <p className="text-caption">
            Quick Access
          </p>

          <h2 className="mt-3 font-serif text-3xl font-normal text-[#1A1A1A]">
            Everything You Need
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-7 md:grid-cols-3">
          {/* Plan Stay */}
          <Card className="flex min-h-[260px] flex-col p-8 md:p-9">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#E8E5E0] bg-[#FBF9F6] text-[#C5A85C]">
              <CalendarDays size={22} />
            </div>

            <h3 className="mt-7 font-serif text-2xl text-[#1A1A1A]">
              Plan My Stay
            </h3>

            <p className="mt-4 text-base leading-7 text-[#737373]">
              Start a new booking and personalize every detail
              of your stay and event.
            </p>

            <div className="mt-auto pt-7">
              <Link href="/booking">
                <Button>
                  Start Booking
                </Button>
              </Link>
            </div>
          </Card>

          {/* My Bookings */}
          <Card className="flex min-h-[260px] flex-col p-8 md:p-9">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#E8E5E0] bg-[#FBF9F6] text-[#C5A85C]">
              <BookOpen size={22} />
            </div>

            <h3 className="mt-7 font-serif text-2xl text-[#1A1A1A]">
              My Bookings
            </h3>

            <p className="mt-4 text-base leading-7 text-[#737373]">
              Review your recent reservations and keep track
              of their current status.
            </p>

            <p className="mt-auto pt-7 text-sm font-semibold text-[#C5A85C]">
              {totalBookings} recent booking
              {totalBookings === 1 ? '' : 's'}
            </p>
          </Card>

          {/* Account */}
          <Card className="flex min-h-[260px] flex-col p-8 md:p-9">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#E8E5E0] bg-[#FBF9F6] text-[#C5A85C]">
              <UserRound size={22} />
            </div>

            <h3 className="mt-7 font-serif text-2xl text-[#1A1A1A]">
              Account
            </h3>

            <p className="mt-4 text-base leading-7 text-[#737373]">
              Your current signed-in account.
            </p>

            <p className="mt-auto break-all pt-7 text-base font-medium text-[#1A1A1A]">
              {user?.email}
            </p>
          </Card>
        </div>
      </section>

      {/* Recent Bookings */}
      <section className="pb-8">
        <Card className="overflow-hidden p-0">
          <div className="border-b border-[#F0EDE9] px-6 py-7 md:px-9 md:py-8">
            <CardHeader
              title="Recent Bookings"
              description="Your latest submitted bookings and their current status."
            />
          </div>

          {!bookings || bookings.length === 0 ? (
            <div className="px-6 py-14 md:px-10 md:py-16">
              <EmptyState
                icon={<CalendarDays size={44} />}
                title="No bookings yet"
                description="Create your first booking and begin planning your stay."
                action={
                  <Link href="/booking">
                    <Button variant="secondary">
                      Plan My Stay
                    </Button>
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
                        <span className="rounded-md bg-[#F5F3F0] px-3 py-1.5 font-mono text-sm text-[#737373]">
                          {booking.booking_id}
                        </span>
                      </td>

                      <td className="font-medium">
                        {formatDate(booking.check_in)}
                      </td>

                      <td className="font-medium">
                        {formatDate(booking.check_out)}
                      </td>

                      <td>
                        {booking.guests}
                      </td>

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
      </section>
    </div>
  )
}