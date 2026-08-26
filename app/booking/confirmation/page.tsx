import type { Metadata } from 'next'
import Link from 'next/link'
import { createServiceClient } from '@/lib/supabase/server'
import { Booking } from '@/lib/types'
import { formatDate } from '@/lib/utils/booking'
import { Card } from '@/components/ui/Card'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { Button } from '@/components/ui/Button'
import { CheckCircle2, ArrowRight, Phone, Clock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Booking Confirmed – Mannat Events',
  description: 'Your wedding enquiry has been submitted successfully.',
}

interface ConfirmationPageProps {
  searchParams: Promise<{ id?: string }>
}

interface DetailRowProps {
  label: string
  value: string | number
  mono?: boolean
}

function DetailRow({ label, value, mono = false }: DetailRowProps) {
  return (
    <div className="flex justify-between items-center py-3 border-b border-[#F0EDE9] last:border-0">
      <span className="text-xs font-semibold uppercase tracking-wider text-[#A8A8A8]">{label}</span>
      <span className={mono ? 'font-mono text-xs text-[#1A1A1A] bg-[#FAF8F5] px-2 py-0.5 rounded' : 'text-sm font-semibold text-[#1A1A1A]'}>
        {value}
      </span>
    </div>
  )
}

export default async function ConfirmationPage({ searchParams }: ConfirmationPageProps) {
  const { id: bookingId } = await searchParams

  // Fetch booking details (best-effort via service client — no RLS restriction)
  let booking: Booking | null = null
  if (bookingId) {
    try {
      const serviceClient = createServiceClient()
      const { data } = await serviceClient
        .from('bookings')
        .select('*')
        .eq('booking_id', bookingId)
        .single()
      booking = data as Booking | null
    } catch {
      /* show generic confirmation if DB read fails */
    }
  }

  const displayId = booking?.booking_id ?? bookingId ?? 'ME-ENQUIRY'

  const dayPlans = (booking?.day_plans ?? []) as any[]
  const peakGuests = dayPlans.length > 0
    ? Math.max(...dayPlans.map(p => Math.max(p.lunch?.guest_count ?? 0, p.dinner?.guest_count ?? 0)))
    : null

  return (
    <div
      className="min-h-screen flex items-start justify-center pt-16 pb-24 px-4"
      style={{ background: 'radial-gradient(circle at 10% 20%, #FAF8F5 0%, #F5EDD6 100%)' }}
    >
      <div className="max-w-xl w-full space-y-8 animate-fade-up">

        {/* Success Banner */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#F0FDF4] border-2 border-[#BBF7D0] text-[#065F46] mb-2">
            <CheckCircle2 size={32} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#065F46]">Enquiry Received</p>
            <h1 className="text-3xl font-serif font-medium text-[#1A1A1A] mt-2">
              Your Wedding Enquiry<br />is Confirmed!
            </h1>
            <p className="mt-3 text-sm text-[#737373] max-w-sm mx-auto leading-relaxed">
              Thank you for choosing Mannat Events. Our team will reach out within <strong>24 hours</strong> to discuss your customized wedding package.
            </p>
          </div>
        </div>

        {/* Booking Details Card */}
        <Card className="p-0 overflow-hidden bg-white shadow-lg border border-[#E8E2D8]">
          <div className="px-6 py-4 border-b border-[#F0EDE9] bg-gradient-to-r from-[#FDFCFA] to-[#FAF6EE]">
            <p className="text-[10px] uppercase tracking-[0.22em] text-[#C5A85C] font-bold mb-0.5">Wedding Folio</p>
            <h2 className="text-base font-semibold text-[#1A1A1A]">Enquiry Reference Details</h2>
          </div>
          <div className="px-6 py-2">
            <DetailRow label="Reference ID" value={displayId} mono />
            {booking && (
              <>
                <div className="flex justify-between items-center py-3 border-b border-[#F0EDE9]">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#A8A8A8]">Status</span>
                  <StatusBadge status={booking.status} />
                </div>
                <DetailRow label="Check-in"  value={formatDate(booking.check_in)} />
                <DetailRow label="Check-out" value={formatDate(booking.check_out)} />
                <DetailRow label="Duration"  value={`${booking.duration} ${booking.duration === 1 ? 'night' : 'nights'}`} />
                {peakGuests && peakGuests > 0 && (
                  <DetailRow label="Peak Guests" value={peakGuests} />
                )}
                {booking.selected_hotel && (
                  <>
                    <DetailRow label="Selected Venue" value={booking.selected_hotel.name} />
                    <DetailRow label="Estimated Total" value={`₹${booking.selected_hotel.package_price.toLocaleString('en-IN')}`} />
                  </>
                )}
              </>
            )}
          </div>
        </Card>

        {/* What Happens Next */}
        <div className="rounded-2xl border border-[#E8D9A8] bg-[#FDFAF3] p-5 space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-[#A08040]">What Happens Next?</p>
          <div className="space-y-3 text-xs text-[#737373]">
            <div className="flex items-start gap-3">
              <Clock size={15} className="text-[#C5A85C] mt-0.5 shrink-0" />
              <span>Our wedding coordinator will call you within <strong className="text-[#1A1A1A]">24 hours</strong> to review your selection and confirm availability.</span>
            </div>
            <div className="flex items-start gap-3">
              <Phone size={15} className="text-[#C5A85C] mt-0.5 shrink-0" />
              <span>You can also reach us directly at <strong className="text-[#1A1A1A]">+91 98765 43210</strong> for urgent queries.</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 pt-2">
          <Link href="/booking" className="flex-1">
            <Button variant="gold" size="lg" className="w-full flex items-center justify-center gap-2">
              Plan Another Stay <ArrowRight size={14} />
            </Button>
          </Link>
          <Link href="/" className="flex-1">
            <Button variant="secondary" size="lg" className="w-full">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
