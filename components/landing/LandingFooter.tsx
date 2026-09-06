'use client'

import Link from 'next/link'

export function LandingFooter() {
  return (
    <footer
      className="relative py-16 px-6 md:px-12"
      style={{ background: '#0A0807', borderTop: '1px solid rgba(201,168,76,0.1)' }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-14">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold"
                style={{ background: 'linear-gradient(135deg, #9A7B2E, #C9A84C)', color: '#0A0807' }}
              >
                M
              </div>
              <span className="font-semibold text-sm tracking-[0.22em] uppercase" style={{ color: '#FAF3E8' }}>
                Mannat Events
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-6" style={{ color: 'rgba(250,243,232,0.4)' }}>
              India&apos;s premier destination wedding specialists. Crafting unforgettable celebrations across palaces, haveli estates and scenic retreats.
            </p>
            <p className="text-xs" style={{ color: 'rgba(201,168,76,0.5)', letterSpacing: '0.15em' }}>
              ✦ DESTINATION WEDDING SPECIALISTS
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <p className="text-caption mb-6" style={{ color: '#C9A84C' }}>Quick Links</p>
            <ul className="space-y-3">
              {[
                { label: 'Plan Your Wedding', href: '/booking' },
                { label: 'My Dashboard', href: '/dashboard' },
                { label: 'Book Now', href: '/booking' },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors duration-200"
                    style={{ color: 'rgba(250,243,232,0.45)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#C9A84C')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(250,243,232,0.45)')}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Destinations */}
          <div>
            <p className="text-caption mb-6" style={{ color: '#C9A84C' }}>Our Destinations</p>
            <ul className="space-y-3">
              {['Udaipur, Rajasthan', 'Jaipur, Rajasthan', 'Goa', 'Kerala Backwaters', 'Jim Corbett', 'Shimla Hills'].map((dest) => (
                <li key={dest} className="flex items-center gap-2">
                  <span style={{ color: 'rgba(201,168,76,0.4)', fontSize: '8px' }}>◆</span>
                  <span className="text-sm" style={{ color: 'rgba(250,243,232,0.4)' }}>{dest}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px mb-8" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.15), transparent)' }} />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs" style={{ color: 'rgba(250,243,232,0.3)' }}>
            © {new Date().getFullYear()} Mannat Events. All rights reserved.
          </p>
          <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: 'rgba(201,168,76,0.4)' }}>
            Where Forever Begins
          </p>
        </div>
      </div>
    </footer>
  )
}
