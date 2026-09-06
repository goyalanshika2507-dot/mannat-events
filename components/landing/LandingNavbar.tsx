'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldCheck } from 'lucide-react'

interface Props {
  isLoggedIn: boolean
  isAdmin?: boolean
}

export function LandingNavbar({ isLoggedIn, isAdmin }: Props) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background: scrolled ? 'rgba(10,8,7,0.92)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(201,168,76,0.1)' : '1px solid transparent',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold transition-transform duration-300 group-hover:rotate-3 shadow-md"
              style={{ background: 'linear-gradient(135deg, #9A7B2E, #C9A84C)', color: '#0A0807' }}
            >
              M
            </div>
            <span className="font-semibold text-sm tracking-[0.22em] uppercase" style={{ color: '#FAF3E8' }}>
              Mannat Events
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {[
              { label: 'Offerings', href: '#offerings' },
              { label: 'Venues',    href: '#destinations' },
              { label: 'Gallery',   href: '#gallery' },
              { label: 'Process',   href: '#process' },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-medium transition-colors duration-200"
                style={{ color: 'rgba(250,243,232,0.6)' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#C9A84C')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(250,243,232,0.6)')}
              >
                {item.label}
              </a>
            ))}

            {/* Clearly Visible ADMIN PANEL Option */}
            <Link
              href="/admin"
              className="text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full transition-all duration-200 flex items-center gap-1.5 hover:scale-105"
              style={{
                color: '#C5A85C',
                border: '1px solid rgba(197,168,92,0.4)',
                background: 'rgba(197,168,92,0.1)',
              }}
            >
              <ShieldCheck size={14} />
              <span>ADMIN PANEL</span>
            </Link>
          </nav>

          {/* CTA Header Actions */}
          <div className="hidden md:flex items-center gap-4">
            {isLoggedIn && (
              <Link href="/dashboard">
                <button
                  className="rounded-full px-5 py-2.5 text-xs font-semibold tracking-wider transition-all duration-300 hover:text-white"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    color: 'rgba(250,243,232,0.8)',
                    border: '1px solid rgba(201,168,76,0.25)'
                  }}
                >
                  My Dashboard
                </button>
              </Link>
            )}

            <Link href={isLoggedIn ? '/dashboard' : '/booking'}>
              <button
                className="rounded-full px-6 py-2.5 text-xs font-bold uppercase tracking-widest transition-all duration-300 hover:opacity-90 cursor-pointer"
                style={{
                  background: 'linear-gradient(135deg, #9A7B2E, #C5A85C)',
                  color: '#0A0807',
                  boxShadow: '0 4px 20px rgba(201,168,76,0.3)',
                }}
              >
                VIEW RESERVATION
              </button>
            </Link>

            <Link href="/admin">
              <button
                className="rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-widest transition-all duration-300 hover:scale-105 shadow-lg flex items-center gap-2 cursor-pointer"
                style={{
                  background: 'linear-gradient(135deg, #C5A85C 0%, #E8D9A8 50%, #A08040 100%)',
                  color: '#0A0807',
                  border: '1px solid #E8D9A8',
                  boxShadow: '0 4px 20px rgba(201,168,76,0.35)',
                }}
              >
                <ShieldCheck size={15} />
                <span>ADMIN PANEL</span>
              </button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <span className="block w-6 h-px transition-all duration-300" style={{ background: '#C9A84C', transform: mobileOpen ? 'translateY(5px) rotate(45deg)' : 'none' }} />
            <span className="block w-4 h-px transition-all duration-300" style={{ background: '#C9A84C', opacity: mobileOpen ? 0 : 1 }} />
            <span className="block w-6 h-px transition-all duration-300" style={{ background: '#C9A84C', transform: mobileOpen ? 'translateY(-5px) rotate(-45deg)' : 'none' }} />
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 flex flex-col md:hidden"
            style={{ background: 'rgba(10,8,7,0.97)', paddingTop: '80px' }}
          >
            <nav className="flex flex-col items-center gap-8 py-12">
              {[
                { label: 'Offerings', href: '#offerings' },
                { label: 'Venues',    href: '#destinations' },
                { label: 'Gallery',   href: '#gallery' },
                { label: 'Process',   href: '#process' },
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="font-serif text-3xl font-light"
                  style={{ color: '#FAF3E8' }}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <div className="flex flex-col gap-4 mt-4 w-full px-8">
                <Link href="/admin" onClick={() => setMobileOpen(false)}>
                  <button className="w-full rounded-full py-4 font-bold text-xs tracking-widest uppercase flex items-center justify-center gap-2"
                    style={{ background: 'linear-gradient(135deg, #C5A85C, #E8D9A8)', color: '#0A0807' }}>
                    <ShieldCheck size={16} /> ADMIN PANEL
                  </button>
                </Link>

                <Link href={isLoggedIn ? '/dashboard' : '/booking'} onClick={() => setMobileOpen(false)}>
                  <button className="w-full rounded-full py-4 font-bold text-xs tracking-widest uppercase"
                    style={{ background: 'linear-gradient(135deg, #9A7B2E, #C5A85C)', color: '#0A0807' }}>
                    VIEW RESERVATION
                  </button>
                </Link>

                {isLoggedIn && (
                  <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                    <button className="w-full rounded-full py-3.5 font-medium text-sm tracking-wider"
                      style={{ border: '1px solid rgba(201,168,76,0.3)', color: '#FAF3E8' }}>
                      My Dashboard
                    </button>
                  </Link>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
