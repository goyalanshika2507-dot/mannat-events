import type { Metadata } from 'next'
import { LoginForm } from '@/components/auth/LoginForm'

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your Mannat Events account.',
}

export default function LoginPage() {
  return (
    <div
      className="bg-white rounded-[18px] border border-[#E8E5E0] p-8"
      style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.06)' }}
    >
      <h2 className="text-xl font-semibold text-[#1A1A1A] mb-1 tracking-tight">Welcome back</h2>
      <p className="text-sm text-[#A8A8A8] mb-8">Sign in to manage your bookings.</p>
      <LoginForm />
    </div>
  )
}
