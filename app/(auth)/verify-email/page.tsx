import type { Metadata } from 'next'
import { Suspense } from 'react'
import { VerifyEmailContent } from '@/components/auth/VerifyEmailContent'

export const metadata: Metadata = {
  title: 'Verify Email',
  description: 'Verify your Mannat Events account email address.',
}

export default function VerifyEmailPage() {
  return (
    <div className="luxury-card luxury-card-glow rounded-[20px] p-8">
      <Suspense
        fallback={
          <div className="flex justify-center py-12">
            <span
              className="h-6 w-6 animate-spin rounded-full border-2 border-brand-gold border-t-transparent"
              aria-label="Loading..."
            />
          </div>
        }
      >
        <VerifyEmailContent />
      </Suspense>
    </div>
  )
}
