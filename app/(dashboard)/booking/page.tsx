import type { Metadata } from 'next'
import { BookingWizard } from '@/components/booking/BookingWizard'

export const metadata: Metadata = {
  title: 'Plan My Stay',
  description: 'Plan your stay with Mannat Events.',
}

export default function BookingPage() {
  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-12">
      {/* Page Header */}
      <div className="mb-12">
        <p className="text-sm font-medium uppercase tracking-widest text-[#C9A84C] mb-2">
          Folio Creation
        </p>

        <h1 className="text-5xl font-light text-[#1A1A1A]">
          Plan My Stay
        </h1>

        <p className="mt-4 text-base text-[#737373] max-w-lg">
          Indicate check-in dates, guest headcount, and event preferences.
        </p>
      </div>

      <BookingWizard />
    </div>
  )
}