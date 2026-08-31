import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { BookingTable } from '@/components/admin/BookingTable'
import { Booking } from '@/lib/types'
import { AdminSummaryCards } from '@/components/admin/AdminSummaryCards'
import { AdminSearch } from '@/components/admin/AdminSearch'
import {
  OccupancyAnalytics,
  ActivityTimeline,
} from '@/components/admin/AdminPlaceholders'
import {
  ShieldCheck,
  Package,
  Utensils,
  Grid,
  Sparkles,
  Flame,
  PlusCircle,
  Palette,
  CalendarCheck,
  PhoneOff,
  Settings,
  Layers,
  FileText
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Admin Panel — Mannat Events',
  description: 'Manage bookings, packages, pricing, menus, decorations, and portal configuration.',
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

const MANAGEMENT_SECTIONS = [
  { href: '/admin',                    title: 'Bookings',            desc: 'View & manage customer event enquiries', icon: FileText,    count: 'Live' },
  { href: '/admin/packages',            title: 'Packages & Pricing', desc: 'Banquet package per-head rates & taglines', icon: Package,     count: '6 Pkgs' },
  { href: '/admin/menu-categories',     title: 'Categories',          desc: 'Starters, main course, drinks & sweets', icon: Grid,        count: '15 Cats' },
  { href: '/admin/menu-items',          title: 'Menu Items',          desc: 'Master dish catalog & active state',     icon: Utensils,    count: '209 Items' },
  { href: '/admin/package-config',      title: 'Package Limits',      desc: 'Selection limit count per category',     icon: Layers,      count: 'Config' },
  { href: '/admin/live-stations',       title: 'Live Stations',       desc: 'Live counters, chaat, & barbecue',       icon: Flame,       count: '5 Stations' },
  { href: '/admin/package-config',      title: 'Add-ons',             desc: 'Optional food add-ons & counters',       icon: PlusCircle,  count: '8 Addons' },
  { href: '/admin/decoration-packages', title: 'Decoration Packages', desc: 'Silver, Gold, Platinum, Luxury tiers',   icon: Sparkles,    count: '4 Tiers' },
  { href: '/admin/functions',           title: 'Event Functions',     desc: 'Day-wise function dropdown options',     icon: CalendarCheck, count: '13 Functions' },
  { href: '/admin/themes',              title: 'Themes',              desc: 'Visual theme gallery & stage setups',     icon: Palette,     count: 'Themes' },
  { href: '/admin/blocked-phones',      title: 'Blocked Phones',      desc: 'Spam prevention & blocked contacts',     icon: PhoneOff,    count: 'Blocklist' },
  { href: '/admin/settings',            title: 'Settings',            desc: 'System config & database re-seeding',    icon: Settings,    count: 'System' },
]

export default async function AdminPage({
  searchParams,
}: AdminPageProps) {
  const { status, bookingId, email, from, to } = await searchParams
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

  const today = new Date().toLocaleDateString('en-CA', {
    timeZone: 'Asia/Kolkata',
  })

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
      booking.customer_email?.toLowerCase().includes(value)
    )
  }

  if (from) {
    filteredBookings = filteredBookings.filter(
      (booking) => new Date(booking.created_at) >= new Date(from)
    )
  }

  if (to) {
    const endDate = new Date(to)
    endDate.setHours(23, 59, 59, 999)
    filteredBookings = filteredBookings.filter(
      (booking) => new Date(booking.created_at) <= endDate
    )
  }

  return (
    <div className="space-y-10">
      {/* ── ADMIN PANEL HEADER ── */}
      <div className="bg-[#1A1A1A] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-[#C5A85C]/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#C5A85C]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-[#C5A85C]/20 border border-[#C5A85C]/40 text-[#C5A85C] text-[10px] font-bold tracking-widest uppercase flex items-center gap-1.5">
                <ShieldCheck size={14} /> AUTHORIZED MANAGEMENT PORTAL
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-wide">
              ADMIN PANEL
            </h1>
            <p className="mt-2 text-sm text-[#A8A8A8] max-w-2xl leading-relaxed">
              Full real-time administration dashboard for Mannat Events. Manage bookings, menu catalog, banquet package rates, decoration tiers, live counters, and functions.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/dashboard"
              className="px-4 py-2.5 rounded-xl border border-white/20 hover:border-white text-xs font-bold uppercase tracking-wider text-white transition-all"
            >
              Customer View
            </Link>
          </div>
        </div>
      </div>

      {/* ── MANAGEMENT CARDS GRID ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-serif font-bold text-[#1A1A1A] uppercase tracking-wider flex items-center gap-2">
            <span>⚙</span> Management Sections
          </h2>
          <span className="text-xs text-[#737373]">12 Active Modules</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {MANAGEMENT_SECTIONS.map((sec) => {
            const Icon = sec.icon
            return (
              <Link
                key={sec.title}
                href={sec.href}
                className="group p-4 rounded-2xl border border-[#E8E2D8] bg-white hover:border-[#C5A85C] hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 rounded-xl bg-[#F5EDD6] border border-[#E8D9A8] flex items-center justify-center text-[#A08040] group-hover:bg-[#C5A85C] group-hover:text-white transition-colors">
                      <Icon size={18} />
                    </div>
                    <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-[#FAF6EE] border border-[#EEEAE4] text-[#A08040]">
                      {sec.count}
                    </span>
                  </div>
                  <h3 className="font-semibold text-sm text-[#1A1A1A] group-hover:text-[#A08040] transition-colors">
                    {sec.title}
                  </h3>
                  <p className="text-xs text-[#737373] mt-1 leading-normal">
                    {sec.desc}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#F0EDE9] flex items-center justify-between text-[11px] font-semibold text-[#A08040] group-hover:translate-x-1 transition-transform">
                  <span>Manage Module</span>
                  <span>→</span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* ── BOOKING OVERVIEW & ANALYTICS ── */}
      <div className="space-y-6 pt-4 border-t border-[#E8E2D8]">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-serif font-bold text-[#1A1A1A] uppercase tracking-wider">
            Booking Operations &amp; Enquiries
          </h2>
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
                  const isActive = (status ?? '') === filter.value
                  const params = new URLSearchParams()
                  if (filter.value) params.set('status', filter.value)
                  if (bookingId) params.set('bookingId', bookingId)
                  if (email) params.set('email', email)
                  if (from) params.set('from', from)
                  if (to) params.set('to', to)

                  const href = `/admin${params.toString() ? `?${params.toString()}` : ''}`

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

            <BookingTable bookings={filteredBookings} />

            <p className="text-xs text-[#A8A8A8] pb-4">
              Showing {filteredBookings.length} of {bookings.length} bookings
            </p>
          </div>

          <div className="space-y-6 lg:sticky lg:top-24">
            <OccupancyAnalytics />
            <ActivityTimeline />
          </div>
        </div>
      </div>
    </div>
  )
}