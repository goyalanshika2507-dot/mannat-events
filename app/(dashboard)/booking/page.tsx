import type { Metadata } from 'next'
import { BookingWizard } from '@/components/booking/BookingWizard'

export const metadata: Metadata = {
  title: 'Plan My Stay',
  description: 'Plan your stay with Mannat Events.',
}

export default function BookingPage() {
  return (
    <div className="w-full">
      {/* Page Header */}
      <section className="mb-12 border-b border-[#E8E5E0] pb-10 md:mb-16 md:pb-12">
        <div className="max-w-3xl">
          <p className="text-caption">
            Folio Creation
          </p>

          <h1 className="mt-4 text-headline">
            Plan My Stay
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-[#737373]">
            Build your personalized stay by selecting your dates,
            guest details, event preferences and additional services.
          </p>
        </div>
      </section>

      {/* Booking Wizard */}
      <section className="pb-16">
        <BookingWizard />
      </section>
    </div>
  )
}