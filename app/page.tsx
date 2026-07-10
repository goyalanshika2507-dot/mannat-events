import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/Button'
import { ArrowRight, Calendar, Star, Shield, Award, Sparkles, MapPin } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Mannat Events — Bespoke Event & Hospitality Management',
  description: 'Experience unmatched luxury and seamless hospitality booking for your elite corporate and private gatherings.',
}

export default async function RootPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-brand-cream text-brand-obsidian flex flex-col selection:bg-brand-gold-light selection:text-brand-obsidian relative overflow-hidden">
      
      {/* Textured noise overlay for subtle organic depth */}
      <div className="absolute inset-0 luxury-noise pointer-events-none z-40 select-none" />

      {/* Ambient background glows for visual layering */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-brand-gold/5 blur-[120px] pointer-events-none select-none" />
      <div className="absolute top-1/3 left-0 w-[500px] h-[500px] rounded-full bg-brand-gold/5 blur-[100px] pointer-events-none select-none" />

      {/* Top Navigation */}
      <header className="sticky top-0 z-50 bg-brand-cream/80 backdrop-blur-md border-b border-brand-border">
        <div className="max-w-6xl mx-auto px-6 h-[80px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <span
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold transition-transform group-hover:rotate-3"
              style={{ background: '#C5A85C' }}
            >
              M
            </span>
            <span className="text-xs font-bold tracking-[0.25em] text-brand-obsidian uppercase font-sans">
              Mannat Events
            </span>
          </Link>

          <nav className="flex items-center gap-8">
            {user ? (
              <Link href="/dashboard">
                <Button variant="gold" size="sm" className="flex items-center gap-2">
                  Go to Dashboard <ArrowRight size={14} />
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login" className="text-[11px] font-bold uppercase tracking-widest text-[#737373] hover:text-[#1A1A1A] transition-colors">
                  Sign In
                </Link>
                <Link href="/signup">
                  <Button variant="primary" size="sm" className="shadow-sm">
                    Create Account
                  </Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center bg-ambient-hero overflow-hidden border-b border-brand-border px-6 py-24">
        
        {/* Soft floating decorative circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-brand-gold/10 blur-[130px] pointer-events-none select-none" />

        <div className="max-w-4xl mx-auto text-center space-y-10 relative z-10">
          <div className="flex items-center justify-center gap-3">
            <span className="divider-gold w-8" />
            <p className="text-caption text-brand-gold font-semibold tracking-[0.2em]">Exquisite Occasions</p>
            <span className="divider-gold w-8" />
          </div>

          <h1 className="text-display">
            Bespoke Gatherings <br />
            <span className="italic font-light text-brand-gold font-serif">Perfected.</span>
          </h1>

          <p className="text-body-lg text-brand-stone max-w-2xl mx-auto font-light leading-relaxed">
            Discover a sophisticated booking interface tailored for organizing elite stays, luxury cuisines, and customized private celebrations.
          </p>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href={user ? '/booking' : '/signup'} className="w-full sm:w-auto">
              <Button variant="gold" size="lg" className="w-full sm:w-auto flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-300">
                Plan Your Stay <Calendar size={15} />
              </Button>
            </Link>
            {!user && (
              <Link href="/login" className="w-full sm:w-auto">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto border-[#FAF6F0] bg-white">
                  Manage Booking
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Philosophy Callout Section */}
      <section className="relative py-32 bg-brand-cream-dark/50 overflow-hidden border-b border-brand-border">
        {/* Soft gold ambient light */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-brand-gold/8 blur-[90px] pointer-events-none select-none" />
        
        <div className="max-w-4xl mx-auto px-6 text-center space-y-8 relative z-10">
          <p className="text-caption">The Atelier Philosophy</p>
          <blockquote className="font-serif text-2xl md:text-4xl italic font-light leading-relaxed text-brand-obsidian">
            "Simplicity is the ultimate sophistication. We design stay and culinary experiences that linger in memory, orchestrated with absolute discretion."
          </blockquote>
          <div className="flex items-center justify-center gap-4 pt-2">
            <span className="w-10 h-px bg-brand-gold" />
            <span className="text-[10px] uppercase tracking-[0.25em] text-brand-stone font-bold">Mannat Concierge</span>
            <span className="w-10 h-px bg-brand-gold" />
          </div>
        </div>
      </section>

      {/* Core Features & Hospitality Standards */}
      <section className="py-36 relative overflow-hidden border-b border-brand-border">
        {/* Ambient bottom-right light */}
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-brand-gold/5 blur-[110px] pointer-events-none select-none" />

        <div className="max-w-6xl mx-auto px-6 w-full space-y-24 relative z-10">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <span className="divider-gold w-6" />
              <p className="text-caption text-brand-gold">Our Offerings</p>
              <span className="divider-gold w-6" />
            </div>
            <h2 className="text-headline">Bespoke Hospitality Standards</h2>
            <p className="text-sm text-brand-stone max-w-md mx-auto leading-relaxed">
              We provide a curated planner to manage stay durations, guest accommodations, and personalized menus day-by-day.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="luxury-card rounded-[18px] p-8 space-y-6 shadow-[0_4px_24px_rgba(26,26,26,0.02)] hover:shadow-[0_12px_38px_rgba(26,26,26,0.05)] hover:-translate-y-1 transition-all duration-300 relative group overflow-hidden">
              <div className="absolute top-0 right-0 w-[150px] h-[150px] rounded-full bg-brand-gold/5 blur-[40px] group-hover:bg-brand-gold/10 transition-colors" />
              <div className="w-12 h-12 rounded-xl bg-brand-cream border border-brand-border flex items-center justify-center text-brand-gold shadow-sm">
                <Star size={20} className="stroke-[1.5]" />
              </div>
              <h3 className="text-xl font-serif text-brand-obsidian">Curated Lodging</h3>
              <p className="text-sm text-brand-stone leading-relaxed font-light">
                Elite rooms configured with architectural luxury styling, refined space dynamics, and high-end room hospitality.
              </p>
            </div>

            {/* Card 2 */}
            <div className="luxury-card rounded-[18px] p-8 space-y-6 shadow-[0_4px_24px_rgba(26,26,26,0.02)] hover:shadow-[0_12px_38px_rgba(26,26,26,0.05)] hover:-translate-y-1 transition-all duration-300 relative group overflow-hidden">
              <div className="absolute top-0 right-0 w-[150px] h-[150px] rounded-full bg-brand-gold/5 blur-[40px] group-hover:bg-brand-gold/10 transition-colors" />
              <div className="w-12 h-12 rounded-xl bg-brand-cream border border-brand-border flex items-center justify-center text-brand-gold shadow-sm">
                <Award size={20} className="stroke-[1.5]" />
              </div>
              <h3 className="text-xl font-serif text-brand-obsidian">Gastronomy</h3>
              <p className="text-sm text-brand-stone leading-relaxed font-light">
                Tailor vegetarian and non-vegetarian menus day-by-day. A premium hot breakfast is complimentary each day.
              </p>
            </div>

            {/* Card 3 */}
            <div className="luxury-card rounded-[18px] p-8 space-y-6 shadow-[0_4px_24px_rgba(26,26,26,0.02)] hover:shadow-[0_12px_38px_rgba(26,26,26,0.05)] hover:-translate-y-1 transition-all duration-300 relative group overflow-hidden">
              <div className="absolute top-0 right-0 w-[150px] h-[150px] rounded-full bg-brand-gold/5 blur-[40px] group-hover:bg-brand-gold/10 transition-colors" />
              <div className="w-12 h-12 rounded-xl bg-brand-cream border border-brand-border flex items-center justify-center text-brand-gold shadow-sm">
                <Shield size={20} className="stroke-[1.5]" />
              </div>
              <h3 className="text-xl font-serif text-brand-obsidian">Elite Management</h3>
              <p className="text-sm text-brand-stone leading-relaxed font-light">
                Seamless booking pipelines, detailed status badges, and real-time coordinator review for error-free gatherings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Asymmetric Elegant Contrast Banner (Dark Obsidian Theme) */}
      <section className="py-32 bg-brand-obsidian text-white relative overflow-hidden border-b border-black">
        {/* Soft golden light behind columns */}
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-brand-gold/10 blur-[130px] pointer-events-none select-none" />

        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          <div className="space-y-6">
            <p className="text-caption text-brand-gold">Exclusivity</p>
            <h2 className="text-headline text-white leading-tight">Tailored for Discerning Gathering Hosts</h2>
            <p className="text-brand-stone text-sm leading-relaxed font-light">
              Every gathering tells a story. Mannat Events coordinates premium lodging, custom menu options, and clean status reports to execute flawless banquets, retreats, and boutique occasions.
            </p>
            <div className="pt-4">
              <Link href="/signup">
                <Button variant="outline" className="border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-white transition-all duration-300">
                  Request Access
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-4 backdrop-blur-sm">
              <p className="text-3xl font-light font-serif text-brand-gold">01</p>
              <p className="text-sm font-semibold text-white">Private Lodging</p>
              <p className="text-xs text-brand-stone font-light leading-relaxed">Absolute privacy inside pristine, fully secured venues.</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-4 translate-y-6 backdrop-blur-sm">
              <p className="text-3xl font-light font-serif text-brand-gold">02</p>
              <p className="text-sm font-semibold text-white">Curated Meals</p>
              <p className="text-xs text-brand-stone font-light leading-relaxed">Cuisine crafted precisely around your itinerary schedules.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Metrics */}
      <section className="bg-white border-b border-brand-border py-20 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
          <div className="space-y-1">
            <p className="text-4xl font-light font-serif text-brand-obsidian">99.8%</p>
            <p className="text-caption text-brand-stone text-[10px] tracking-wider font-bold">Client Retention</p>
          </div>
          <div className="space-y-1">
            <p className="text-4xl font-light font-serif text-brand-obsidian">15,000+</p>
            <p className="text-caption text-brand-stone text-[10px] tracking-wider font-bold">Meals Configured</p>
          </div>
          <div className="space-y-1">
            <p className="text-4xl font-light font-serif text-brand-obsidian">24/7</p>
            <p className="text-caption text-brand-stone text-[10px] tracking-wider font-bold">Concierge Support</p>
          </div>
          <div className="space-y-1">
            <p className="text-4xl font-light font-serif text-brand-obsidian">100%</p>
            <p className="text-caption text-brand-stone text-[10px] tracking-wider font-bold">Privacy Guarantee</p>
          </div>
        </div>
      </section>

      {/* Elegant Call to Action */}
      <section className="py-36 relative overflow-hidden">
        {/* Central warm spotlight */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full bg-brand-gold/10 blur-[120px] pointer-events-none select-none" />

        <div className="max-w-4xl mx-auto px-6 text-center space-y-10 relative z-10">
          <h2 className="text-headline font-serif text-brand-obsidian">Begin Planning Your Reservation</h2>
          <p className="text-brand-stone max-w-md mx-auto leading-relaxed font-light text-sm">
            Create an account to gain access to our custom lodging wizard and customize meals day-by-day.
          </p>
          <div>
            <Link href={user ? '/booking' : '/signup'}>
              <Button variant="gold" size="lg" className="shadow-md hover:shadow-lg transition-all duration-300">
                Begin Planning
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-brand-border bg-white py-16">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8 text-center">
          <p className="text-xs text-brand-stone font-light tracking-wide">
            © {new Date().getFullYear()} Mannat Events. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-gold">Bespoke Hospitality Portal</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
