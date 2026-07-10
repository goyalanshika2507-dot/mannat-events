import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  async function handleLogout() {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
  }

  return (
    <div className="min-h-screen flex flex-col bg-brand-cream relative overflow-hidden">
      {/* Textured noise overlay */}
      <div className="absolute inset-0 luxury-noise pointer-events-none z-0 select-none" />
      
      {/* Ambient background glow */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-brand-gold/5 blur-[100px] pointer-events-none select-none z-0" />

      {/* Sticky nav */}
      <header
        className="sticky top-0 z-40 bg-brand-cream/80 backdrop-blur-md relative z-10"
        style={{ borderBottom: '1px solid rgba(197, 168, 92, 0.08)', boxShadow: '0 4px 12px rgba(26, 26, 26, 0.01)' }}
      >
        <div className="max-w-6xl mx-auto px-6 h-[64px] flex items-center justify-between">
          {/* Brand */}
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <span
              className="w-6 h-6 rounded-md flex items-center justify-center text-white text-[10px] font-bold"
              style={{ background: '#C5A85C' }}
            >
              M
            </span>
            <span className="text-xs font-bold tracking-[0.2em] text-[#1A1A1A] uppercase">
              Mannat Events
            </span>
          </Link>

          {/* Nav links */}
          <nav className="hidden sm:flex items-center gap-6">
            <Link
              href="/admin"
              className="text-[10px] font-bold uppercase tracking-widest text-[#737373] hover:text-[#1A1A1A] transition-colors duration-200"
            >
              Admin Panel
            </Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <span className="text-xs text-[#737373] hidden sm:block truncate max-w-[200px] font-mono">
              {user.email}
            </span>
            <form action={handleLogout}>
              <Button type="submit" variant="ghost" size="sm">
                Sign Out
              </Button>
            </form>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-12 relative z-10">
        {children}
      </main>
    </div>
  )
}
