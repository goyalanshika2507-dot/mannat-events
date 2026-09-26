'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogoutButton } from '@/components/auth/LogoutButton'
import {
  LayoutDashboard,
  CalendarCheck2,
  FolderTree,
  UtensilsCrossed,
  Sparkles,
  Sliders,
  Flower2,
  CalendarDays,
  Settings,
  ShieldCheck,
  Menu,
  X,
  ExternalLink,
  ChevronRight,
  Palette,
  ShieldX,
  Building2
} from 'lucide-react'

interface NavGroup {
  title: string
  items: {
    href: string
    label: string
    icon: any
    badge?: string
  }[]
}

const NAV_GROUPS: NavGroup[] = [
  {
    title: 'OVERVIEW',
    items: [
      { href: '/admin', label: 'Dashboard / Overview', icon: LayoutDashboard },
      { href: '/admin/bookings', label: 'Bookings', icon: CalendarCheck2, badge: 'Live' },
    ],
  },
  {
    title: 'VENUE & MENU',
    items: [
      { href: '/admin/hotels', label: 'Hotel Management', icon: Building2 },
      { href: '/admin/menu/limits', label: 'Package & Menu Management', icon: UtensilsCrossed },
      { href: '/admin/menu/packages', label: 'Packages & Pricing', icon: Sparkles },
    ],
  },
  {
    title: 'DECORATION',
    items: [
      { href: '/admin/decoration-packages', label: 'Decoration Packages', icon: Flower2 },
      { href: '/admin/themes', label: 'Themes', icon: Palette },
    ],
  },
  {
    title: 'EVENT CONFIGURATION',
    items: [
      { href: '/admin/functions', label: 'Lunch / Dinner Functions', icon: CalendarDays },
    ],
  },
  {
    title: 'SYSTEM & SECURITY',
    items: [
      { href: '/admin/blocked-phones', label: 'Blocked Phones', icon: ShieldX },
      { href: '/admin/settings', label: 'Settings', icon: Settings },
    ],
  },
]

export function AdminSidebarNav({ profile }: { profile: any }) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const isLinkActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin'
    return pathname === href || pathname.startsWith(href + '/')
  }

  const renderNavContent = () => (
    <div className="flex flex-col h-full bg-[#0D0D0F] border-r border-[#C5A85C]/20 text-[#E8E2D8]">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#C5A85C]/20 relative bg-linear-to-b from-[#141418] to-[#0D0D0F]">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-serif font-bold text-base shadow-md border border-[#C5A85C]/40"
            style={{ background: 'linear-gradient(135deg, #9A7B2E 0%, #C9A84C 50%, #7A5B1E 100%)' }}
          >
            M
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#C5A85C] flex items-center gap-1">
                <ShieldCheck size={12} /> ADMIN PANEL
              </span>
            </div>
            <h1 className="text-sm font-bold tracking-wider text-white font-serif uppercase">
              Mannat Events
            </h1>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin scrollbar-thumb-[#26262B]">
        {NAV_GROUPS.map((group) => (
          <div key={group.title} className="space-y-1">
            <div className="px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#C5A85C]/70 mb-2">
              {group.title}
            </div>
            {group.items.map((item) => {
              const active = isLinkActive(item.href)
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`group flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                    active
                      ? 'bg-linear-to-r from-[#C5A85C]/20 to-[#9A7B2E]/10 border border-[#C5A85C]/40 text-white font-semibold shadow-xs'
                      : 'text-[#A1A1AA] hover:text-white hover:bg-[#18181C] hover:border hover:border-[#C5A85C]/20'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      size={16}
                      className={`transition-colors ${
                        active ? 'text-[#C5A85C]' : 'text-[#71717A] group-hover:text-[#C5A85C]'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge ? (
                    <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-full bg-[#C5A85C]/20 text-[#C5A85C] border border-[#C5A85C]/30">
                      {item.badge}
                    </span>
                  ) : active ? (
                    <ChevronRight size={14} className="text-[#C5A85C]" />
                  ) : null}
                </Link>
              )
            })}
          </div>
        ))}
      </div>

      {/* Bottom Profile & Actions */}
      <div className="p-4 border-t border-[#C5A85C]/20 bg-[#121215] space-y-3">
        <div className="flex items-center justify-between px-2 py-1.5 rounded-lg bg-[#1A1A1E] border border-[#27272A]">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-7 h-7 rounded-full bg-[#C5A85C]/20 border border-[#C5A85C]/40 flex items-center justify-center text-[#C5A85C] text-xs font-bold shrink-0">
              👑
            </div>
            <div className="truncate">
              <p className="text-[11px] font-bold text-white truncate">
                {profile.full_name || 'Mannat Admin'}
              </p>
              <p className="text-[10px] text-[#A1A1AA] truncate font-mono">
                {profile.phone || 'Admin'}
              </p>
            </div>
          </div>
          <span className="px-1.5 py-0.5 rounded-xs text-[9px] font-bold uppercase bg-[#C5A85C] text-black">
            Admin
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-xl text-[11px] font-semibold text-[#D4D4D8] bg-[#18181C] hover:bg-[#27272A] border border-[#27272A] transition-all"
          >
            <ExternalLink size={12} className="text-[#C5A85C]" />
            <span>Customer View</span>
          </Link>
          <div className="flex items-center justify-center">
            <LogoutButton />
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 fixed inset-y-0 left-0 z-30">
        {renderNavContent()}
      </aside>

      {/* Mobile Bar Header */}
      <div className="lg:hidden sticky top-0 z-40 bg-[#0D0D0F] border-b border-[#C5A85C]/30 px-4 h-16 flex items-center justify-between text-white">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-xl bg-[#1A1A1E] border border-[#C5A85C]/30 text-[#C5A85C]"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div>
            <span className="text-[9px] font-bold tracking-widest text-[#C5A85C] uppercase block">
              ADMIN PANEL
            </span>
            <span className="text-sm font-serif font-bold text-white uppercase">
              Mannat Events
            </span>
          </div>
        </div>

        <Link
          href="/dashboard"
          className="text-xs font-semibold text-[#C5A85C] bg-[#1A1A1E] border border-[#C5A85C]/30 px-3 py-1.5 rounded-lg flex items-center gap-1"
        >
          Customer View
        </Link>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-xs"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-72 max-w-[80vw] h-full z-10">
            {renderNavContent()}
          </div>
        </div>
      )}
    </>
  )
}
