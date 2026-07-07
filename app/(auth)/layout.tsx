import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your Mannat Events account.',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        {/* Brand */}
        <div className="mb-8 text-center">
          <h1 className="text-xl font-semibold text-gray-900">Mannat Events</h1>
          <p className="mt-1 text-sm text-gray-500">Booking Management Platform</p>
        </div>
        {children}
      </div>
    </div>
  )
}
