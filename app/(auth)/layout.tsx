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
      className="min-h-screen flex items-center justify-center px-4 py-16 bg-brand-cream relative overflow-hidden"
    >
      {/* Textured noise overlay */}
      <div className="absolute inset-0 luxury-noise pointer-events-none z-0 select-none" />
      
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-brand-gold/5 blur-[120px] pointer-events-none select-none z-0" />

      <div className="w-full max-w-[440px] animate-fade-up relative z-10">
        {/* Brand mark */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-brand-obsidian mb-4 shadow-sm border border-brand-border">
            <span className="text-white text-xs font-bold tracking-tight">M</span>
          </div>
          <h1 className="text-xl font-bold tracking-[0.2em] text-[#1A1A1A] uppercase font-sans">Mannat Events</h1>
          <p className="mt-2 text-xs uppercase tracking-widest text-[#737373] font-semibold">Hospitality Portal</p>
        </div>

        {/* Content */}
        {children}
      </div>
    </div>
  )
}
