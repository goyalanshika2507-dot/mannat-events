'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

interface Props {
  isLoggedIn: boolean
  isAdmin?: boolean
}

const SLIDES = [
  {
    id: 1,
    image: '/venue_palace.png',
    title: 'Taj View Terraces',
    subtitle: 'Panoramic Vistas of India’s Greatest Monument of Love',
  },
  {
    id: 2,
    image: '/wedding_mandap.png',
    title: 'Mughal Sandstone Pavilions',
    subtitle: 'Timeless Architecture Framed in Golden Dusk Light',
  },
  {
    id: 3,
    image: '/wedding_feast.png',
    title: 'Imperial Culinary Banquets',
    subtitle: 'Bespoke Feast Experiences Designed with Intention',
  },
]

export function HeroSection({ isLoggedIn, isAdmin }: Props) {
  const [current, setCurrent] = useState(0)

  // Autoplay slideshow every 7 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length)
    }, 7000)
    return () => clearInterval(timer)
  }, [])

  const slide = SLIDES[current]

  return (
    <section className="relative min-h-screen flex items-center justify-start overflow-hidden">
      
      {/* ── Viewport Invitation Frame (Creative Invitation Look) ── */}
      <div className="absolute inset-4 pointer-events-none z-30 border border-[#C5A85C]/20 rounded-[24px] hidden sm:block" />
      <div className="absolute inset-6 pointer-events-none z-30 border border-[#C5A85C]/10 rounded-[20px] hidden sm:block" />

      {/* ── Fullscreen Slideshow Background ── */}
      <div className="absolute inset-0 z-0 bg-black">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
            className="absolute inset-0 w-full h-full"
          >
            {/* The Image with active Ken Burns effect */}
            <motion.img
              src={slide.image}
              alt={slide.title}
              initial={{ scale: 1 }}
              animate={{ scale: 1.06 }}
              transition={{ duration: 7, ease: 'linear' }}
              className="w-full h-full object-cover"
            />
            {/* Immersive Dark Vignette Overlay for Premium Readability */}
            <div 
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(to right, rgba(10,8,7,0.92) 0%, rgba(10,8,7,0.7) 40%, rgba(10,8,7,0.5) 70%, rgba(10,8,7,0.85) 100%)'
              }}
            />
            <div 
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(to top, rgba(10,8,7,0.95) 0%, transparent 50%, rgba(10,8,7,0.4) 100%)'
              }}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Ambient Floating Particles / Star Lights (Creative Accents) ── */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <div
          className="absolute w-[600px] h-[600px] rounded-full top-[-10%] right-[10%] opacity-20 blur-[130px]"
          style={{ background: 'radial-gradient(circle, rgba(197,168,92,0.12) 0%, transparent 70%)' }}
        />
        <div
          className="absolute w-[400px] h-[400px] rounded-full bottom-[-10%] left-[5%] opacity-20 blur-[130px]"
          style={{ background: 'radial-gradient(circle, rgba(197,168,92,0.08) 0%, transparent 70%)' }}
        />
      </div>

      {/* ── Main Content Container (Normal structured layout) ── */}
      <div className="max-w-7xl mx-auto px-8 sm:px-12 w-full relative z-20 pt-12">
        <div className="max-w-3xl flex flex-col items-start text-left">
          
          {/* Tagline Badge */}
          <div className="mb-6 flex items-center gap-3">
            <span className="h-px w-8 block" style={{ background: '#C5A85C' }} />
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#C5A85C]">
              Royal Destination Wedding Planners in Agra
            </span>
          </div>

          {/* Headline - Clean & Impactful */}
          <h1 
            className="text-4xl sm:text-6xl md:text-7xl font-light leading-[1.08] mb-6 text-[#FAF3E8]"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            Where Royal Heritage
            <br />
            Meets <span className="gold-text-animate italic font-light">Forever.</span>
          </h1>

          {/* Slide Subtitle - Changing with slideshow */}
          <div className="min-h-[40px] mb-6">
            <AnimatePresence mode="wait">
              <motion.p
                key={slide.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.5 }}
                className="font-serif text-xl sm:text-2xl font-light text-[#C5A85C]/90 italic"
              >
                {slide.subtitle}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Description */}
          <p 
            className="text-sm sm:text-base leading-relaxed mb-10 max-w-xl"
            style={{ color: 'rgba(250,243,232,0.65)' }}
          >
            Orchestrating bespoke, grand celebrations across Agra’s finest Taj-facing terraces, majestic red sandstone estates, and luxurious palace hotels. We translate your dreams into royal legacies.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Link href="/booking" className="w-full sm:w-auto">
              <button
                className="group relative w-full sm:w-auto overflow-hidden rounded-full px-10 py-4.5 font-bold text-xs tracking-widest uppercase transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2"
                style={{
                  background: 'linear-gradient(135deg, #9A7B2E 0%, #C5A85C 50%, #E8C97A 100%)',
                  color: '#0A0807',
                  boxShadow: '0 8px 30px rgba(197,168,92,0.25)',
                }}
              >
                <span className="relative z-10">Start Planning</span>
                <ArrowRight size={13} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: 'linear-gradient(135deg, #C5A85C 0%, #E8C97A 50%, #C5A85C 100%)' }}
                />
              </button>
            </Link>

            <Link href={isAdmin ? '/admin' : (isLoggedIn ? '/dashboard' : '/login')} className="w-full sm:w-auto">
              <button
                className="w-full sm:w-auto rounded-full px-9 py-4.5 font-bold text-xs tracking-widest uppercase transition-all duration-300 border hover:bg-white/[0.03]"
                style={{
                  border: '1px solid rgba(197,168,92,0.3)',
                  color: 'rgba(250,243,232,0.85)',
                }}
              >
                {isAdmin ? 'ADMIN PANEL' : 'View Reservation'}
              </button>
            </Link>
          </div>

        </div>
      </div>

      {/* ── Slide Thumbnail Indicators (Normal + Creative controller) ── */}
      <div className="absolute bottom-12 right-12 z-35 flex items-center gap-4">
        {SLIDES.map((s, index) => {
          const isActive = index === current
          return (
            <button
              key={s.id}
              onClick={() => setCurrent(index)}
              className="relative text-left group focus:outline-none"
            >
              {/* Outer boundary ring */}
              <div 
                className="w-16 h-16 rounded-xl p-0.5 border transition-all duration-300 overflow-hidden"
                style={{
                  borderColor: isActive ? '#C5A85C' : 'rgba(255,255,255,0.1)',
                  boxShadow: isActive ? '0 0 15px rgba(197,168,92,0.2)' : 'none',
                }}
              >
                <img 
                  src={s.image} 
                  alt={s.title} 
                  className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-500" 
                />
              </div>
              
              {/* Little floating dot for active indicator */}
              {isActive && (
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#C5A85C] border border-[#0A0807] shadow-sm" />
              )}
            </button>
          )
        })}
      </div>

    </section>
  )
}
