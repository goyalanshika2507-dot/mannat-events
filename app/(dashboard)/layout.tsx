import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { LogoutButton } from '@/components/auth/LogoutButton'
import { ShieldCheck, LayoutDashboard, Calendar, ChevronRight } from 'lucide-react'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Overview',    icon: '◈' },
  { href: '/booking',   label: 'Plan Wedding', icon: '❋' },
]

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, role, phone, email')
    .eq('id', user.id)
    .single()

  const isAdmin = profile?.role === 'admin'
  const displayName = profile?.full_name || profile?.phone || user.email || 'Guest'
  const initials = displayName
    .split(' ')
    .map((w: string) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const subLabel = profile?.phone || user.email || ''

  return (
    <div className="min-h-screen flex" style={{ background: '#0A0807' }}>

      {/* ── SIDEBAR (desktop) ───────────────────────── */}
      <aside
        className="hidden lg:flex flex-col w-64 shrink-0 fixed inset-y-0 left-0 z-40"
        style={{
          background: 'linear-gradient(180deg, #120F0B 0%, #0A0807 100%)',
          borderRight: '1px solid rgba(201,168,76,0.15)',
        }}
      >
        {/* Brand */}
        <div className="p-6 border-b flex items-center justify-between" style={{ borderColor: 'rgba(201,168,76,0.1)' }}>
          <Link href="/" className="flex items-center gap-3 group">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold transition-transform group-hover:rotate-3 shadow-md"
              style={{ background: 'linear-gradient(135deg, #9A7B2E, #C9A84C)', color: '#0A0807' }}
            >
              M
            </div>
            <div>
              <p className="font-semibold text-xs tracking-[0.2em] uppercase" style={{ color: '#FAF3E8' }}>
                Mannat Events
              </p>
              <p className="text-[10px] tracking-wider uppercase" style={{ color: 'rgba(201,168,76,0.7)' }}>
                {isAdmin ? '🛡️ Admin Portal' : 'Wedding Portal'}
              </p>
            </div>
          </Link>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {/* PROMINENT ADMIN PANEL BUTTON IN SIDEBAR */}
          {isAdmin && (
            <Link
              href="/admin"
              className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 shadow-md group mb-4"
              style={{
                background: 'linear-gradient(135deg, #C5A85C 0%, #E8D9A8 50%, #9A7B2E 100%)',
                color: '#0A0807',
                border: '1px solid #E8D9A8'
              }}
            >
              <div className="flex items-center gap-2.5">
                <ShieldCheck size={18} className="text-[#0A0807]" />
                <span className="tracking-wider uppercase text-xs">Admin Panel</span>
              </div>
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          )}

          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group"
              style={{ color: 'rgba(250,243,232,0.7)' }}
            >
              <span className="text-base transition-colors duration-200" style={{ color: 'rgba(201,168,76,0.6)' }}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* User card at bottom */}
        <div className="p-4 border-t" style={{ borderColor: 'rgba(201,168,76,0.1)' }}>
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 shadow-sm"
              style={{ background: 'linear-gradient(135deg, #9A7B2E, #C9A84C)', color: '#0A0807' }}
            >
              {initials}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-medium truncate" style={{ color: '#FAF3E8' }}>
                  {displayName}
                </p>
                {isAdmin && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#C5A85C] text-[#0A0807]">
                    ADMIN
                  </span>
                )}
              </div>
              {subLabel && (
                <p className="text-xs truncate" style={{ color: 'rgba(250,243,232,0.35)' }}>
                  {subLabel}
                </p>
              )}
            </div>
          </div>
          <LogoutButton
            label="Sign Out →"
            className="w-full text-left text-xs font-medium py-2 px-3 rounded-lg"
          />
        </div>
      </aside>

      {/* ── MOBILE TOP BAR ─────────────────────────── */}
      <div
        className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 h-16"
        style={{ background: 'rgba(10,8,7,0.95)', borderBottom: '1px solid rgba(201,168,76,0.15)', backdropFilter: 'blur(20px)' }}
      >
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
            style={{ background: 'linear-gradient(135deg, #9A7B2E, #C9A84C)', color: '#0A0807' }}>
            M
          </div>
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[#FAF3E8]">
            Mannat
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {isAdmin && (
            <Link
              href="/admin"
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-[#C5A85C] to-[#E8D9A8] text-[#0A0807] flex items-center gap-1 shadow-sm"
            >
              <ShieldCheck size={14} /> Admin Panel
            </Link>
          )}
          <LogoutButton label="Sign Out" />
        </div>
      </div>

      {/* ── MAIN CONTENT WRAPPER WITH TOP HEADER ─────── */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        
        {/* ── TOP HEADER BAR (Desktop) ────────────────── */}
        <header
          className="hidden lg:flex items-center justify-between px-8 py-4 sticky top-0 z-30"
          style={{
            background: 'rgba(10,8,7,0.85)',
            borderBottom: '1px solid rgba(201,168,76,0.12)',
            backdropFilter: 'blur(16px)'
          }}
        >
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-[rgba(250,243,232,0.5)]">
              Mannat Events
            </span>
            <span className="text-[rgba(201,168,76,0.4)]">•</span>
            <span className="text-xs font-medium text-[#FAF3E8]">
              Dashboard
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* TOP RIGHT PROMINENT ADMIN PANEL BUTTON */}
            {isAdmin && (
              <Link href="/admin">
                <button
                  className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-md hover:scale-105 hover:shadow-lg cursor-pointer"
                  style={{
                    background: 'linear-gradient(135deg, #C5A85C 0%, #E8D9A8 50%, #A08040 100%)',
                    color: '#0A0807',
                    border: '1px solid #E8D9A8'
                  }}
                >
                  <ShieldCheck size={16} className="text-[#0A0807]" />
                  <span>Admin Panel</span>
                </button>
              </Link>
            )}

            <div className="h-4 w-px bg-[rgba(201,168,76,0.15)]" />

            <span className="text-xs font-mono text-[rgba(250,243,232,0.6)]">
              {displayName}
            </span>

            <LogoutButton label="Sign Out" />
          </div>
        </header>

        {/* ── MAIN CONTENT ───────────────────────────── */}
        <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
          {children}
        </main>
      </div>

      {/* ── MOBILE BOTTOM TAB BAR ──────────────────── */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 flex"
        style={{ background: 'rgba(10,8,7,0.97)', borderTop: '1px solid rgba(201,168,76,0.1)', backdropFilter: 'blur(20px)' }}
      >
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors"
            style={{ color: 'rgba(250,243,232,0.5)' }}
          >
            <span style={{ fontSize: '18px' }}>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  )
}