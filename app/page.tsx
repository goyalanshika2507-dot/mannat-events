import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { LandingNavbar }      from '@/components/landing/LandingNavbar'
import { HeroSection }        from '@/components/landing/HeroSection'
import { MarqueeStrip }       from '@/components/landing/MarqueeStrip'
import { OfferingsSection }   from '@/components/landing/OfferingsSection'
import { GallerySection }     from '@/components/landing/GallerySection'
import { ProcessSection }     from '@/components/landing/ProcessSection'
import { TestimonialsSection } from '@/components/landing/TestimonialsSection'
import { CTASection }         from '@/components/landing/CTASection'
import { LandingFooter }      from '@/components/landing/LandingFooter'
import { DestinationsSection } from '@/components/landing/DestinationsSection'

export const metadata: Metadata = {
  title: 'Mannat Events — Royal Destination Weddings in Agra',
  description:
    'Plan your dream destination wedding in Agra with Mannat Events. Exquisite Taj Mahal view terraces, majestic Mughal gardens, curated banquets and unforgettable ceremonies.',
  openGraph: {
    title: 'Mannat Events — Where Forever Begins in Agra',
    description: 'Agra\'s premier destination wedding specialists.',
    images: ['/wedding_mandap.png'],
  },
}

export default async function RootPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const isLoggedIn = !!user

  let isAdmin = false
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    isAdmin = profile?.role === 'admin'
  }

  return (
    <div className="relative" style={{ background: '#0A0807' }}>
      <LandingNavbar isLoggedIn={isLoggedIn} isAdmin={isAdmin} />

      <main>
        <HeroSection isLoggedIn={isLoggedIn} />
        <MarqueeStrip />
        <section id="offerings">
          <OfferingsSection />
        </section>
        <section id="destinations">
          <DestinationsSection />
        </section>
        <section id="gallery">
          <GallerySection />
        </section>
        <section id="process">
          <ProcessSection />
        </section>
        <TestimonialsSection />
        <CTASection isLoggedIn={isLoggedIn} />
      </main>

      <LandingFooter />
    </div>
  )
}