import type { Metadata } from 'next'
import { SignupForm } from '@/components/auth/SignupForm'

export const metadata: Metadata = {
  title: 'Create Account',
  description: 'Create a new Mannat Events account.',
}

export default function SignupPage() {
  return (
    <div className="luxury-card luxury-card-glow rounded-[20px] p-8">
      <h2 className="text-xl font-serif text-[#1A1A1A] mb-1 tracking-tight">Create account</h2>
      <p className="text-sm text-[#A8A8A8] mb-8 font-light">Start managing your events with Mannat.</p>
      <SignupForm />
    </div>
  )
}
