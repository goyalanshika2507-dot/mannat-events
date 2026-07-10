import type { Metadata } from 'next'
import { SignupForm } from '@/components/auth/SignupForm'

export const metadata: Metadata = {
  title: 'Create Account',
  description: 'Create a new Mannat Events account.',
}

export default function SignupPage() {
  return (
    <div
      className="bg-white rounded-[18px] border border-[#E8E5E0] p-8"
      style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.06)' }}
    >
      <h2 className="text-xl font-semibold text-[#1A1A1A] mb-1 tracking-tight">Create account</h2>
      <p className="text-sm text-[#A8A8A8] mb-8">Start managing your events with Mannat.</p>
      <SignupForm />
    </div>
  )
}
