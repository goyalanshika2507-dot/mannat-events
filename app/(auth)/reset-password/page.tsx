import type { Metadata } from 'next'
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm'

export const metadata: Metadata = {
  title: 'Reset Password',
  description: 'Create a new password for your Mannat Events account.',
}

export default function ResetPasswordPage() {
  return (
    <div className="luxury-card luxury-card-glow rounded-[20px] p-8">
      <h2 className="text-xl font-serif text-[#1A1A1A] mb-1 tracking-tight">
        Reset password
      </h2>
      <p className="text-sm text-[#A8A8A8] mb-8 font-light">
        Choose a strong new password for your account.
      </p>
      <ResetPasswordForm />
    </div>
  )
}
