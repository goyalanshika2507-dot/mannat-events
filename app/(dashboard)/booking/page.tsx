import type { Metadata } from 'next'
import { BookingWizard } from '@/components/booking/BookingWizard'
import { Card } from '@/components/ui/Card'

export const metadata: Metadata = {
  title: 'Plan My Stay',
  description: 'Plan your stay with Mannat Events.',
}

export default function BookingPage() {
  return (
    <div className="space-y-10 max-w-3xl mx-auto">
      {/* Page Header */}
      <div>
        <p className="text-caption text-[#C9A84C] mb-2">Folio Creation</p>
        <h1 className="text-headline">Plan My Stay</h1>
        <p className="mt-2 text-sm text-[#737373]">
          Indicate check-in dates, guest headcount, and cuisine preferences.
        </p>
      </div>

      <Card className="p-8 md:p-10 bg-white shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
        <BookingWizard />
      </Card>
    </div>
  )
}
