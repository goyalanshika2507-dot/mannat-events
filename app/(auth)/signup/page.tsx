import type { Metadata } from 'next'
import { SignupForm } from '@/components/auth/SignupForm'
import { Card } from '@/components/ui/Card'

export const metadata: Metadata = {
  title: 'Create Account',
  description: 'Create a new Mannat Events account.',
}

export default function SignupPage() {
  return (
    <Card>
      <h2 className="text-base font-semibold text-gray-900 mb-6">Create an account</h2>
      <SignupForm />
    </Card>
  )
}
