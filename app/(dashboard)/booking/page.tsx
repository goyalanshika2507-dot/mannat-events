import type { Metadata } from 'next'
import { BookingWizard } from '@/components/booking/BookingWizard'
import { Card } from '@/components/ui/Card'

export const metadata: Metadata = {
  title: 'New Booking',
  description: 'Plan your stay with Mannat Events.',
}

export default function BookingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-gray-900">Plan My Stay</h1>
        <p className="mt-1 text-sm text-gray-500">
          Complete the steps below to submit your booking.
        </p>
      </div>
      <Card>
        <BookingWizard />
      </Card>
    </div>
  )
}
