'use client'

import { useState } from 'react'
import { Booking, BookingStatus } from '@/lib/types'
import { formatDate } from '@/lib/utils/booking'
import {
  Search,
  Calendar,
  Phone,
  Mail,
  User,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  Eye,
  X,
  Sparkles,
  ChevronDown
} from 'lucide-react'

interface AdminBookingsClientProps {
  initialBookings: Booking[]
  initialStatus: string
  initialSearch: string
}

const STATUS_FILTERS = [
  { value: '', label: 'All Bookings' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
]

export function AdminBookingsClient({
  initialBookings,
  initialStatus,
  initialSearch,
}: AdminBookingsClientProps) {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings)
  const [activeStatus, setActiveStatus] = useState(initialStatus)
  const [searchQuery, setSearchQuery] = useState(initialSearch)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  // Filter bookings
  const filteredBookings = bookings.filter((b) => {
    if (activeStatus && b.status !== activeStatus) return false
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      const matchId = b.booking_id?.toLowerCase().includes(q)
      const matchPhone = b.phone?.toLowerCase().includes(q)
      const matchEmail = b.customer_email?.toLowerCase().includes(q)
      if (!matchId && !matchPhone && !matchEmail) return false
    }
    return true
  })

  // Quick Status Update
  async function updateStatus(bookingId: string, newStatus: BookingStatus) {
    setUpdatingId(bookingId)
    try {
      const res = await fetch('/api/admin/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ booking_id: bookingId, status: newStatus }),
      })
      if (res.ok) {
        setBookings((prev) =>
          prev.map((b) => (b.booking_id === bookingId ? { ...b, status: newStatus } : b))
        )
        if (selectedBooking && selectedBooking.booking_id === bookingId) {
          setSelectedBooking((prev) => (prev ? { ...prev, status: newStatus } : null))
        }
      }
    } catch (err) {
      console.error('Failed to update status:', err)
    } finally {
      setUpdatingId(null)
    }
  }

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <CheckCircle2 size={13} /> Confirmed
          </span>
        )
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400 text-xs font-semibold">
            <CheckCircle2 size={13} /> Completed
          </span>
        )
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-semibold">
            <XCircle size={13} /> Cancelled
          </span>
        )
      case 'pending':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-semibold animate-pulse">
            <Clock size={13} /> Pending
          </span>
        )
    }
  }

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#121214] p-4 rounded-2xl border border-[#C5A85C]/20">
        {/* Status Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {STATUS_FILTERS.map((tab) => {
            const isActive = activeStatus === tab.value
            const count = tab.value
              ? bookings.filter((b) => b.status === tab.value).length
              : bookings.length

            return (
              <button
                key={tab.value}
                onClick={() => setActiveStatus(tab.value)}
                className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap flex items-center gap-2 ${
                  isActive
                    ? 'bg-[#C5A85C] text-black font-bold shadow-md'
                    : 'text-[#A1A1AA] hover:text-white hover:bg-[#1C1C20]'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                    isActive ? 'bg-black/20 text-black' : 'bg-[#27272A] text-[#A1A1AA]'
                  }`}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#71717A]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search ID, phone, email..."
            className="w-full bg-[#1A1A1E] border border-[#27272A] focus:border-[#C5A85C] text-white text-xs rounded-xl pl-10 pr-4 py-2.5 outline-hidden transition-all placeholder-[#71717A]"
          />
        </div>
      </div>

      {/* Bookings Table / Cards */}
      {filteredBookings.length === 0 ? (
        <div className="text-center py-20 bg-[#121214] rounded-2xl border border-[#27272A] space-y-3">
          <AlertCircle size={36} className="mx-auto text-[#C5A85C]/60" />
          <h3 className="text-base font-serif text-white font-semibold">No Bookings Found</h3>
          <p className="text-xs text-[#A1A1AA] max-w-sm mx-auto">
            No customer bookings match your current filter settings. Newly submitted customer bookings will automatically appear here as &quot;Pending&quot;.
          </p>
        </div>
      ) : (
        <div className="bg-[#121214] rounded-2xl border border-[#C5A85C]/20 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#27272A] bg-[#18181C] text-[11px] font-bold uppercase tracking-wider text-[#C5A85C]">
                  <th className="p-4">Booking ID</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Stay Dates</th>
                  <th className="p-4">Guests & Plan</th>
                  <th className="p-4">Decor Tier</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#27272A] text-xs">
                {filteredBookings.map((b) => {
                  const maxGuests = Array.isArray(b.day_plans) && b.day_plans.length > 0
                    ? Math.max(...b.day_plans.map((p: any) => Math.max(p.lunch?.guest_count ?? 0, p.dinner?.guest_count ?? 0)))
                    : 0

                  return (
                    <tr key={b.booking_id} className="hover:bg-[#18181C]/60 transition-colors group">
                      {/* Booking ID */}
                      <td className="p-4 font-mono font-bold text-white">
                        <span className="bg-[#1A1A1E] px-2.5 py-1 rounded-lg border border-[#27272A] text-[#C5A85C]">
                          {b.booking_id}
                        </span>
                        <div className="text-[10px] font-sans text-[#71717A] mt-1">
                          {new Date(b.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                        </div>
                      </td>

                      {/* Customer */}
                      <td className="p-4 space-y-1">
                        <div className="flex items-center gap-1.5 text-white font-medium">
                          <Phone size={12} className="text-[#C5A85C]" />
                          <span>{b.phone}</span>
                        </div>
                        {b.customer_email && (
                          <div className="flex items-center gap-1.5 text-[11px] text-[#A1A1AA]">
                            <Mail size={12} />
                            <span className="truncate max-w-[160px]">{b.customer_email}</span>
                          </div>
                        )}
                      </td>

                      {/* Stay Dates */}
                      <td className="p-4 space-y-1">
                        <div className="flex items-center gap-1.5 text-white font-medium">
                          <Calendar size={12} className="text-[#C5A85C]" />
                          <span>{formatDate(b.check_in)}</span>
                        </div>
                        <div className="text-[11px] text-[#71717A]">
                          {b.duration} Night{b.duration > 1 ? 's' : ''} (to {formatDate(b.check_out)})
                        </div>
                      </td>

                      {/* Guests & Plan */}
                      <td className="p-4 space-y-1">
                        <div className="text-white font-medium flex items-center gap-1.5">
                          <User size={12} className="text-[#C5A85C]" />
                          <span>{maxGuests > 0 ? `${maxGuests} Guests` : 'Standard'}</span>
                        </div>
                        <div className="text-[11px] text-[#71717A]">
                          {b.day_plans?.length ?? 0} Function Day{(b.day_plans?.length ?? 0) > 1 ? 's' : ''}
                        </div>
                      </td>

                      {/* Decor Tier */}
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#1C1A14] border border-[#C5A85C]/30 text-[#C5A85C] font-semibold text-[11px]">
                          <Sparkles size={11} /> {b.decoration_package || 'Gold'}
                        </span>
                      </td>

                      {/* Status Selector */}
                      <td className="p-4">
                        <div className="relative inline-block">
                          <select
                            disabled={updatingId === b.booking_id}
                            value={b.status}
                            onChange={(e) => updateStatus(b.booking_id, e.target.value as BookingStatus)}
                            className="bg-[#1A1A1E] text-white text-xs font-semibold px-3 py-1.5 rounded-xl border border-[#27272A] focus:border-[#C5A85C] outline-hidden cursor-pointer appearance-none pr-7"
                          >
                            <option value="pending">🟡 Pending</option>
                            <option value="confirmed">🟢 Confirmed</option>
                            <option value="completed">🔵 Completed</option>
                            <option value="cancelled">🔴 Cancelled</option>
                          </select>
                          <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#71717A] pointer-events-none" />
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right">
                        <button
                          onClick={() => setSelectedBooking(b)}
                          className="px-3 py-1.5 rounded-xl bg-[#1A1A1E] hover:bg-[#C5A85C] hover:text-black border border-[#27272A] text-xs font-semibold text-white transition-all flex items-center gap-1.5 ml-auto"
                        >
                          <Eye size={13} /> View
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs overflow-y-auto">
          <div className="bg-[#121214] border border-[#C5A85C]/30 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6 text-white relative">
            <button
              onClick={() => setSelectedBooking(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-[#1C1C20] text-[#A1A1AA] hover:text-white hover:bg-[#27272A] transition-all"
            >
              <X size={18} />
            </button>

            <div>
              <span className="text-[10px] font-bold tracking-widest text-[#C5A85C] uppercase block mb-1">
                BOOKING DETAILS
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-white flex items-center gap-3">
                {selectedBooking.booking_id}
                {getStatusBadge(selectedBooking.status)}
              </h2>
            </div>

            {/* Quick Grid Info */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-[#18181C] border border-[#27272A]">
              <div>
                <span className="text-[10px] text-[#A1A1AA] uppercase tracking-wider block">Phone</span>
                <span className="font-semibold text-xs text-white">{selectedBooking.phone}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#A1A1AA] uppercase tracking-wider block">Email</span>
                <span className="font-semibold text-xs text-white truncate block">{selectedBooking.customer_email}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#A1A1AA] uppercase tracking-wider block">Check-in</span>
                <span className="font-semibold text-xs text-white">{formatDate(selectedBooking.check_in)}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#A1A1AA] uppercase tracking-wider block">Check-out</span>
                <span className="font-semibold text-xs text-white">{formatDate(selectedBooking.check_out)}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#A1A1AA] uppercase tracking-wider block">Duration</span>
                <span className="font-semibold text-xs text-white">{selectedBooking.duration} Nights</span>
              </div>
              <div>
                <span className="text-[10px] text-[#A1A1AA] uppercase tracking-wider block">Decoration Tier</span>
                <span className="font-semibold text-xs text-[#C5A85C]">{selectedBooking.decoration_package || 'Gold'}</span>
              </div>
            </div>

            {/* Status Update Buttons */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#C5A85C] uppercase tracking-wider block">
                Update Status
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['pending', 'confirmed', 'completed', 'cancelled'] as BookingStatus[]).map((st) => (
                  <button
                    key={st}
                    onClick={() => updateStatus(selectedBooking.booking_id, st)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold capitalize border transition-all ${
                      selectedBooking.status === st
                        ? 'bg-[#C5A85C] text-black border-[#C5A85C] shadow-md'
                        : 'bg-[#18181C] text-[#A1A1AA] border-[#27272A] hover:text-white hover:bg-[#27272A]'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Day Plans */}
            {selectedBooking.day_plans && selectedBooking.day_plans.length > 0 && (
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#C5A85C]">
                  Day-wise Function &amp; Meal Plans
                </h4>
                <div className="space-y-3">
                  {selectedBooking.day_plans.map((plan: any) => (
                    <div key={plan.day} className="p-4 rounded-xl bg-[#18181C] border border-[#27272A] text-xs space-y-2">
                      <div className="flex justify-between items-center text-white font-bold">
                        <span>Day {plan.day}</span>
                        <span className="text-[#A1A1AA] font-normal">{plan.rooms ?? 1} Rooms</span>
                      </div>
                      {plan.lunch && (
                        <div className="text-[11px] text-[#D4D4D8] bg-[#121214] p-2 rounded-lg border border-[#27272A]">
                          <strong className="text-emerald-400">Lunch ({plan.lunch.type}):</strong> {plan.lunch.guest_count} guests
                          {plan.lunch.menu_config?.packageName && (
                            <span className="text-[#C5A85C] ml-2">• Package: {plan.lunch.menu_config.packageName}</span>
                          )}
                        </div>
                      )}
                      {plan.dinner && (
                        <div className="text-[11px] text-[#D4D4D8] bg-[#121214] p-2 rounded-lg border border-[#27272A]">
                          <strong className="text-rose-400">Dinner ({plan.dinner.type}):</strong> {plan.dinner.guest_count} guests
                          {plan.dinner.menu_config?.packageName && (
                            <span className="text-[#C5A85C] ml-2">• Package: {plan.dinner.menu_config.packageName}</span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notes / Selected Hotel */}
            {selectedBooking.notes && (
              <div className="p-4 rounded-xl bg-[#18181C] border border-[#27272A] text-xs space-y-1">
                <span className="text-[10px] text-[#A1A1AA] uppercase font-bold tracking-wider block">Notes</span>
                <p className="text-[#D4D4D8]">{selectedBooking.notes}</p>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedBooking(null)}
                className="px-5 py-2.5 rounded-xl bg-[#C5A85C] text-black font-bold text-xs hover:bg-[#D4AF37] transition-all"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
