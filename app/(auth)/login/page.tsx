import type { Metadata } from 'next'
import { LoginForm } from '@/components/auth/LoginForm'
import { Card } from '@/components/ui/Card'

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your Mannat Events account.',
}

export default function LoginPage() {
  return (
    <Card>
      <h2 className="text-base font-semibold text-gray-900 mb-6">Sign in</h2>
      <LoginForm />
    </Card>
  )
}
