import type { Metadata } from 'next'
import { Suspense } from 'react'
import { LoginForm } from '@/components/auth/LoginForm'

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your Mannat Events account.',
}

export default function LoginPage() {
  return (
    <div className="luxury-card luxury-card-glow rounded-[20px] p-8">
      <h2 className="text-xl font-serif text-[#1A1A1A] mb-1 tracking-tight">Welcome back</h2>
      <p className="text-sm text-[#A8A8A8] mb-8 font-light">Sign in to manage your bookings.</p>
      <Suspense
        fallback={
          <div className="flex justify-center py-8">
            <span
              className="h-6 w-6 animate-spin rounded-full border-2 border-[#1A1A1A] border-t-transparent"
              aria-label="Loading"
            />
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  )
}
