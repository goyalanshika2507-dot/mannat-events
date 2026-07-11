import type { Metadata } from 'next'
import { BookingWizard } from '@/components/booking/BookingWizard'

export const metadata: Metadata = {
  title: 'Plan My Stay',
  description: 'Plan your stay with Mannat Events.',
}

export default function BookingPage() {
  return (
    <div className="w-full max-w-7xl mx-auto space-y-10">
      {/* Page Header */}
      <div>
        <p className="text-caption text-[#C9A84C] mb-2">
          Folio Creation
        </p>

        <h1 className="text-headline">
          Plan My Stay
        </h1>

        <p className="mt-2 text-sm text-[#737373]">
          Indicate check-in dates, guest headcount, and event preferences.
        </p>
      </div>

      <BookingWizard />
    </div>
  )
}