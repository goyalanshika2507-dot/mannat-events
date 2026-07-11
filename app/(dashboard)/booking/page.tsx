import type { Metadata } from 'next'
import { BookingWizard } from '@/components/booking/BookingWizard'

export const metadata: Metadata = {
  title: 'Plan My Stay',
  description: 'Plan your stay with Mannat Events.',
}

export default function BookingPage() {
  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-12">
      {/* Page Header - Added space below */}
      <div className="mb-16">
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

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
        
        {/* Questionnaire (Left 2/3) - BookingWizard yahan rahega */}
        <div className="lg:col-span-2">
          <BookingWizard />
        </div>
        
        {/* Live Summary (Right 1/3) - mt-20 ne ise neeche shift kar diya hai */}
        <div className="hidden lg:block lg:col-span-1 mt-20"> 
          <div className="sticky top-28 bg-[#FDFDFC] p-8 rounded-3xl border border-[#E8E5E0] shadow-sm">
            <h3 className="text-lg font-bold mb-6 text-[#1A1A1A]">Live Summary</h3>
            {/* Live Summary ka content yahan display hoga */}
          </div>
        </div>
      </div>
    </div>
  )
}