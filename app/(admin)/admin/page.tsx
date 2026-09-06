import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Booking } from '@/lib/types'
import {
  ShieldCheck,
  Package,
  FolderTree,
  UtensilsCrossed,
  Sliders,
  Flame,
  PlusCircle,
  Flower2,
  CalendarDays,
  Settings,
  CalendarCheck,
  CheckCircle2,
  Clock,
  XCircle,
  ArrowRight,
  TrendingUp,
  Users,
  Palette,
  ShieldX
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Admin Panel Overview — Mannat Events',
  description: 'Manage bookings, packages, pricing, menus, decorations, and system configuration.',
}

const MANAGEMENT_SECTIONS = [
  { href: '/admin/bookings', title: 'Bookings Management', desc: 'View, filter & manage customer event bookings', icon: CalendarCheck, badge: 'Live Enquiries' },
  { href: '/admin/menu/packages', title: 'Banquet Packages & Pricing', desc: 'Per-head rates, veg/non-veg package options', icon: Package, badge: 'Pricing CMS' },
  { href: '/admin/menu/categories', title: 'Menu Categories', desc: 'Starters, main course, desserts & drinks', icon: FolderTree, badge: '15 Categories' },
  { href: '/admin/menu/items', title: 'Menu Dish Catalog', desc: 'Master dish library & active item state', icon: UtensilsCrossed, badge: 'Food Master' },
  { href: '/admin/menu/limits', title: 'Package Selection Limits', desc: 'Category selection counts for packages', icon: Sliders, badge: 'Config' },
  { href: '/admin/menu/live-stations', title: 'Live Stations', desc: 'Live counters, chaat, tandoor & dosa', icon: Flame, badge: 'Live Counters' },
  { href: '/admin/menu/add-ons', title: 'Food & Counter Add-ons', desc: 'Optional counters, paan stalls & sweets', icon: PlusCircle, badge: 'Add-ons' },
  { href: '/admin/decoration-packages', title: 'Decoration Packages', desc: 'Silver, Gold, Platinum & Luxury tiers', icon: Flower2, badge: 'Decor Tiers' },
  { href: '/admin/themes', title: 'Decoration Themes', desc: 'Visual theme styles & photography presets', icon: Palette, badge: 'Themes' },
  { href: '/admin/functions', title: 'Lunch / Dinner Functions', desc: 'Day planning event dropdown choices', icon: CalendarDays, badge: 'Functions' },
  { href: '/admin/blocked-phones', title: 'Blocked Phone Numbers', desc: 'Blacklisted numbers & spam control', icon: ShieldX, badge: 'Security' },
  { href: '/admin/settings', title: 'System Settings', desc: 'Portal configuration & database status', icon: Settings, badge: 'System' },
]

export default async function AdminOverviewPage() {
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

  for (const b of bookings) {
    if (b.status === 'pending') pending++
    else if (b.status === 'confirmed') confirmed++
    else if (b.status === 'completed') completed++
    else if (b.status === 'cancelled') cancelled++
  }

  const recentBookings = bookings.slice(0, 5)

  return (
    <div className="space-y-10 text-white">
      {/* Banner */}
      <div className="bg-linear-to-r from-[#141418] via-[#1A1A22] to-[#141418] rounded-3xl p-6 sm:p-8 border border-[#C5A85C]/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C5A85C]/10 rounded-full blur-3xl pointer-events-none" />

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
            <p className="mt-2 text-xs sm:text-sm text-[#A1A1AA] max-w-2xl leading-relaxed">
              Mannat Events Central Management CMS. Real-time control over bookings, banquet pricing, food catalog, live counters, and decoration tiers.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/admin/bookings"
              className="px-5 py-2.5 rounded-xl bg-[#C5A85C] text-black font-bold text-xs hover:bg-[#D4AF37] transition-all shadow-md flex items-center gap-1.5"
            >
              Manage Bookings ({pending} Pending) <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-serif font-bold uppercase tracking-wider text-[#C5A85C] flex items-center gap-2">
            <TrendingUp size={16} /> Operational Summary
          </h2>
          <span className="text-xs text-[#71717A] font-mono">Live Database Metrics</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {/* Total */}
          <div className="bg-[#121214] p-5 rounded-2xl border border-[#C5A85C]/20 space-y-2">
            <div className="flex justify-between items-center text-[#A1A1AA]">
              <span className="text-[10px] font-bold uppercase tracking-wider">Total Bookings</span>
              <Users size={16} className="text-[#C5A85C]" />
            </div>
            <p className="text-2xl sm:text-3xl font-serif font-bold text-white">{bookings.length}</p>
            <p className="text-[10px] text-[#71717A]">Lifetime reservations</p>
          </div>

          {/* Pending */}
          <div className="bg-[#121214] p-5 rounded-2xl border border-amber-500/30 space-y-2 relative overflow-hidden">
            <div className="flex justify-between items-center text-amber-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">Pending</span>
              <Clock size={16} />
            </div>
            <p className="text-2xl sm:text-3xl font-serif font-bold text-amber-400">{pending}</p>
            <p className="text-[10px] text-amber-400/70">Awaiting confirmation</p>
          </div>

          {/* Confirmed */}
          <div className="bg-[#121214] p-5 rounded-2xl border border-emerald-500/30 space-y-2">
            <div className="flex justify-between items-center text-emerald-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">Confirmed</span>
              <CheckCircle2 size={16} />
            </div>
            <p className="text-2xl sm:text-3xl font-serif font-bold text-emerald-400">{confirmed}</p>
            <p className="text-[10px] text-emerald-400/70">Approved reservations</p>
          </div>

          {/* Completed */}
          <div className="bg-[#121214] p-5 rounded-2xl border border-blue-500/30 space-y-2">
            <div className="flex justify-between items-center text-blue-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">Completed</span>
              <CheckCircle2 size={16} />
            </div>
            <p className="text-2xl sm:text-3xl font-serif font-bold text-blue-400">{completed}</p>
            <p className="text-[10px] text-blue-400/70">Events concluded</p>
          </div>

          {/* Cancelled */}
          <div className="bg-[#121214] p-5 rounded-2xl border border-rose-500/30 space-y-2 col-span-2 sm:col-span-1">
            <div className="flex justify-between items-center text-rose-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">Cancelled</span>
              <XCircle size={16} />
            </div>
            <p className="text-2xl sm:text-3xl font-serif font-bold text-rose-400">{cancelled}</p>
            <p className="text-[10px] text-rose-400/70">Declined / Withdrawn</p>
          </div>
        </div>
      </div>

      {/* Recent Bookings Quick Access */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-serif font-bold uppercase tracking-wider text-[#C5A85C]">
            Recent Customer Enquiries
          </h2>
          <Link
            href="/admin/bookings"
            className="text-xs font-semibold text-[#C5A85C] hover:underline flex items-center gap-1"
          >
            View All ({bookings.length}) <ArrowRight size={13} />
          </Link>
        </div>

        <div className="bg-[#121214] rounded-2xl border border-[#C5A85C]/20 overflow-hidden shadow-xl">
          {recentBookings.length === 0 ? (
            <div className="p-8 text-center text-[#71717A] text-xs">
              No customer bookings recorded yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#27272A] bg-[#18181C] text-[11px] font-bold uppercase tracking-wider text-[#C5A85C]">
                    <th className="p-4">Booking ID</th>
                    <th className="p-4">Phone</th>
                    <th className="p-4">Check-in</th>
                    <th className="p-4">Check-out</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#27272A]">
                  {recentBookings.map((b) => (
                    <tr key={b.booking_id} className="hover:bg-[#18181C]/60 transition-colors">
                      <td className="p-4 font-mono font-bold text-[#C5A85C]">
                        {b.booking_id}
                      </td>
                      <td className="p-4 text-white font-medium">{b.phone}</td>
                      <td className="p-4 text-[#D4D4D8]">{b.check_in}</td>
                      <td className="p-4 text-[#D4D4D8]">{b.check_out}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                          b.status === 'confirmed'
                            ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                            : b.status === 'completed'
                            ? 'bg-blue-500/15 border-blue-500/30 text-blue-400'
                            : b.status === 'cancelled'
                            ? 'bg-rose-500/15 border-rose-500/30 text-rose-400'
                            : 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                        }`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <Link
                          href="/admin/bookings"
                          className="px-3 py-1.5 rounded-lg bg-[#1A1A1E] hover:bg-[#C5A85C] hover:text-black border border-[#27272A] text-xs font-semibold text-white transition-all inline-flex items-center gap-1"
                        >
                          Details →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* CMS Management Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-serif font-bold uppercase tracking-wider text-[#C5A85C]">
            CMS Management Modules
          </h2>
          <span className="text-xs text-[#71717A]">{MANAGEMENT_SECTIONS.length} Active Control Panels</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MANAGEMENT_SECTIONS.map((sec) => {
            const Icon = sec.icon
            return (
              <Link
                key={sec.title}
                href={sec.href}
                className="group p-5 rounded-2xl border border-[#27272A] bg-[#121214] hover:border-[#C5A85C] hover:bg-[#16161A] transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-[#1E1E24] border border-[#C5A85C]/30 flex items-center justify-center text-[#C5A85C] group-hover:bg-[#C5A85C] group-hover:text-black transition-all">
                      <Icon size={18} />
                    </div>
                    <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-[#1A1A1E] border border-[#27272A] text-[#C5A85C]">
                      {sec.badge}
                    </span>
                  </div>
                  <h3 className="font-semibold text-sm text-white group-hover:text-[#C5A85C] transition-colors">
                    {sec.title}
                  </h3>
                  <p className="text-xs text-[#71717A] mt-1 leading-normal">
                    {sec.desc}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#27272A] flex items-center justify-between text-xs font-semibold text-[#C5A85C] group-hover:translate-x-1 transition-transform">
                  <span>Open Control Panel</span>
                  <ArrowRight size={14} />
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}