import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { LogoutButton } from '@/components/auth/LogoutButton'
import { ShieldCheck, LayoutDashboard } from 'lucide-react'

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

  // Get profile to verify admin role
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('role, full_name, email, phone')
    .eq('id', user.id)
    .single()

  // Only admins can access — redirect non-admins back to dashboard
  if (error || !profile || profile.role !== 'admin') {
    redirect('/dashboard')
  }

  const ADMIN_NAV_LINKS = [
    { href: '/admin',                    label: 'Bookings'         },
    { href: '/admin/packages',            label: 'Packages & Pricing'},
    { href: '/admin/menu-categories',     label: 'Categories'       },
    { href: '/admin/menu-items',          label: 'Menu Items'       },
    { href: '/admin/package-config',      label: 'Package Limits'   },
    { href: '/admin/live-stations',       label: 'Live Stations'    },
    { href: '/admin/decoration-packages', label: 'Decoration'       },
    { href: '/admin/functions',           label: 'Functions'        },
    { href: '/admin/themes',              label: 'Themes'           },
    { href: '/admin/blocked-phones',      label: 'Blocked'          },
    { href: '/admin/settings',            label: 'Settings'         },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-brand-cream relative overflow-hidden">
      {/* Textured noise overlay */}
      <div className="absolute inset-0 luxury-noise pointer-events-none z-0 select-none" />
      
      {/* Ambient background glow */}
      <div className="absolute top-0 right-0 w-[450px] h-[450px] rounded-full bg-brand-gold/5 blur-[110px] pointer-events-none select-none z-0" />

      {/* Sticky nav */}
      <header
        className="sticky top-0 z-40 bg-brand-cream/90 backdrop-blur-md relative z-10"
        style={{ borderBottom: '1px solid rgba(197, 168, 92, 0.15)', boxShadow: '0 4px 20px rgba(26, 26, 26, 0.03)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-[64px] flex items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-4">
            <Link href="/admin" className="flex items-center gap-2.5 group">
              <span
                className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-sm"
                style={{ background: 'linear-gradient(135deg, #9A7B2E, #C9A84C)' }}
              >
                M
              </span>
              <span className="text-xs font-bold tracking-[0.2em] text-[#1A1A1A] uppercase hidden sm:inline">
                Mannat Events
              </span>
            </Link>

            {/* Divider */}
            <span className="h-4 w-px bg-[#E8D9A8]" />
            <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-[0.2em] bg-[#1A1A1A] text-[#C9A84C] flex items-center gap-1">
              <ShieldCheck size={12} /> ADMIN PANEL
            </span>

            <Link
              href="/dashboard"
              className="text-[10px] font-bold uppercase tracking-widest text-[#737373] hover:text-[#1A1A1A] transition-colors duration-200 ml-1 flex items-center gap-1"
            >
              <LayoutDashboard size={12} /> Dashboard
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-[#737373] hidden sm:block font-mono bg-white/60 px-2.5 py-1 rounded-full border border-[#E8E2D8]">
              👤 {profile.full_name || profile.phone || 'Admin'}
            </span>
            <LogoutButton />
          </div>
        </div>

        {/* Admin sub-nav horizontal bar */}
        <div className="bg-[#FAF6EE] border-t border-b border-[#EEEAE4] px-4 sm:px-6 overflow-x-auto py-1.5 scrollbar-none">
          <div className="max-w-7xl mx-auto flex items-center gap-1">
            {ADMIN_NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider text-[#737373] hover:text-[#1A1A1A] hover:bg-white hover:shadow-xs transition-all duration-200 whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 relative z-10">
        {children}
      </main>
    </div>
  )
}