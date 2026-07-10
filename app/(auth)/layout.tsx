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
    <div
      className="min-h-screen flex items-center justify-center px-4 py-16"
      style={{ background: '#FAF8F5' }}
    >
      <div className="w-full max-w-[420px] animate-fade-up">
        {/* Brand mark */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[#1A1A1A] mb-4">
            <span className="text-white text-sm font-bold tracking-tight">M</span>
          </div>
          <h1 className="text-xl font-semibold text-[#1A1A1A] tracking-tight">Mannat Events</h1>
          <p className="mt-1.5 text-sm text-[#A8A8A8]">Hospitality Management Platform</p>
        </div>

        {/* Content */}
        {children}
      </div>
    </div>
  )
}
