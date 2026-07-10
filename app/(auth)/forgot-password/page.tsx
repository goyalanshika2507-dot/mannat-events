import type { Metadata } from 'next'
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm'

export const metadata: Metadata = {
  title: 'Forgot Password',
  description: 'Reset your Mannat Events account password.',
}

export default function ForgotPasswordPage() {
  return (
    <div className="luxury-card luxury-card-glow rounded-[20px] p-8">
      <h2 className="text-xl font-serif text-[#1A1A1A] mb-1 tracking-tight">
        Forgot password
      </h2>
      <p className="text-sm text-[#A8A8A8] mb-8 font-light">
        Enter your email and we&apos;ll send you a reset link.
      </p>
      <ForgotPasswordForm />
    </div>
  )
}
