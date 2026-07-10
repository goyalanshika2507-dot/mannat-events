import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Get profile
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('role, full_name, email')
    .eq('id', user.id)
    .single()

  // Only admins can access
  if (error || !profile || profile.role !== 'admin') {
    redirect('/dashboard')
  }

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
      <div className="absolute top-0 right-0 w-[450px] h-[450px] rounded-full bg-brand-gold/5 blur-[110px] pointer-events-none select-none z-0" />

      {/* Sticky nav */}
      <header
        className="sticky top-0 z-40 bg-brand-cream/80 backdrop-blur-md relative z-10"
        style={{ borderBottom: '1px solid rgba(197, 168, 92, 0.08)', boxShadow: '0 4px 12px rgba(26, 26, 26, 0.01)' }}
      >
        <div className="max-w-7xl mx-auto px-6 h-[64px] flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-6">
            <Link href="/admin" className="flex items-center gap-2.5 group">
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

            {/* Divider */}
            <span className="h-4 w-px bg-brand-border" />
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-brand-gold">
              Admin
            </span>

            <Link
              href="/dashboard"
              className="text-[10px] font-bold uppercase tracking-widest text-[#737373] hover:text-[#1A1A1A] transition-colors duration-200 ml-2"
            >
              Dashboard
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <span className="text-xs text-[#737373] hidden sm:block font-mono">
              {profile.full_name || profile.email}
            </span>
            <form action={handleLogout}>
              <Button type="submit" variant="ghost" size="sm">
                Sign Out
              </Button>
            </form>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-12 relative z-10">
        {children}
      </main>
    </div>
  )
}