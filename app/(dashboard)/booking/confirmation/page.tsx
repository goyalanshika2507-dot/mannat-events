import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Booking } from '@/lib/types'
import { formatDate } from '@/lib/utils/booking'
import { Card } from '@/components/ui/Card'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { Button } from '@/components/ui/Button'
import { CheckCircle2, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Booking Confirmed',
  description: 'Your booking has been submitted successfully.',
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

  if (!bookingId) notFound()

  const supabase = await createClient()
  const { data: booking, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('booking_id', bookingId)
    .single()

  if (error || !booking) notFound()

  const b = booking as Booking

  return (
    <div className="max-w-xl mx-auto space-y-8 py-4 animate-fade-up">
      {/* Success Banner */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#F0FDF4] border border-[#BBF7D0] text-[#065F46] mb-2">
          <CheckCircle2 size={28} />
        </div>
        <div>
          <p className="text-caption text-[#065F46] font-semibold">Success</p>
          <h1 className="text-headline mt-1">Booking Submitted</h1>
          <p className="mt-2 text-sm text-[#737373] max-w-sm mx-auto">
            Your reservation has been recorded and is currently awaiting administrator review.
          </p>
        </div>
      </div>

      <Card className="p-0 overflow-hidden bg-white shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
        <div className="px-6 py-4 border-b border-[#F0EDE9] bg-[#FDFCFA]">
          <p className="text-caption text-[#C9A84C]">Folio Details</p>
        </div>
        <div className="px-6 py-2">
          <DetailRow label="Booking ID" value={b.booking_id} mono />
          <div className="flex justify-between items-center py-3 border-b border-[#F0EDE9]">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#A8A8A8]">Status</span>
            <StatusBadge status={b.status} />
          </div>
          <DetailRow label="Check-in"  value={formatDate(b.check_in)} />
          <DetailRow label="Check-out" value={formatDate(b.check_out)} />
          <DetailRow label="Duration"  value={`${b.duration} ${b.duration === 1 ? 'night' : 'nights'}`} />
          <DetailRow label="Guests"    value={b.guests} />
        </div>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4 pt-2">
        <Link href="/dashboard" className="flex-1">
          <Button variant="secondary" size="lg" className="w-full">
            Back to Dashboard
          </Button>
        </Link>
        <Link href="/booking" className="flex-1">
          <Button variant="gold" size="lg" className="w-full flex items-center justify-center gap-2">
            Plan Another Stay <ArrowRight size={14} />
          </Button>
        </Link>
      </div>
    </div>
  )
}
