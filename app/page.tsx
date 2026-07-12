import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/Button'
import {
  ArrowRight,
  Calendar,
  Star,
  Shield,
  Award,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Mannat Events — Bespoke Event & Hospitality Management',
  description:
    'Experience unmatched luxury and seamless hospitality booking for your elite corporate and private gatherings.',
}

export default async function RootPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-brand-cream text-brand-obsidian">
      {/* Background ambience */}
      <div className="pointer-events-none absolute inset-0 z-40 select-none luxury-noise" />
      <div className="pointer-events-none absolute right-0 top-0 h-[600px] w-[600px] rounded-full bg-brand-gold/5 blur-[120px]" />

      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-brand-border bg-brand-cream/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[82px] max-w-7xl items-center justify-between px-6 lg:px-10">
          <Link
            href="/"
            className="group flex items-center gap-3"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-gold text-sm font-bold text-white transition-transform group-hover:rotate-3">
              M
            </span>

            <span className="text-sm font-bold uppercase tracking-[0.22em] text-brand-obsidian">
              Mannat Events
            </span>
          </Link>

          <nav className="flex items-center gap-4 sm:gap-7">
            {user ? (
              <Link href="/dashboard">
                <Button
                  variant="gold"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  Go to Dashboard
                  <ArrowRight size={16} />
                </Button>
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden text-sm font-semibold text-brand-stone transition-colors hover:text-brand-obsidian sm:block"
                >
                  Sign In
                </Link>

                <Link href="/signup">
                  <Button variant="primary" size="sm">
                    Create Account
                  </Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative flex min-h-[82vh] items-center overflow-hidden border-b border-brand-border px-6 py-24 lg:py-32">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[650px] w-[650px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-gold/10 blur-[140px]" />

        <div className="relative z-10 mx-auto max-w-5xl text-center">
          <div className="mb-8 flex items-center justify-center gap-4">
            <span className="h-px w-10 bg-brand-gold" />

            <p className="text-caption">
              Exquisite Occasions
            </p>

            <span className="h-px w-10 bg-brand-gold" />
          </div>

          <h1 className="text-display">
            Bespoke Gatherings
            <br />
            <span className="font-serif font-light italic text-brand-gold">
              Perfected.
            </span>
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-body-lg">
            Discover a sophisticated planning experience designed
            for luxury stays, curated cuisine and unforgettable
            private celebrations.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href={user ? '/booking' : '/signup'}
              className="w-full sm:w-auto"
            >
              <Button
                variant="gold"
                size="lg"
                className="flex w-full items-center justify-center gap-2 sm:w-auto"
              >
                Plan Your Stay
                <Calendar size={17} />
              </Button>
            </Link>

            {!user && (
              <Link
                href="/login"
                className="w-full sm:w-auto"
              >
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full bg-white sm:w-auto"
                >
                  Manage Booking
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="relative border-b border-brand-border bg-brand-cream-dark/50 px-6 py-24 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-caption">
            The Atelier Philosophy
          </p>

          <blockquote className="mt-8 font-serif text-3xl font-light italic leading-[1.55] text-brand-obsidian md:text-4xl">
            “Simplicity is the ultimate sophistication. We design
            stay and culinary experiences that linger in memory,
            orchestrated with absolute discretion.”
          </blockquote>

          <div className="mt-8 flex items-center justify-center gap-4">
            <span className="h-px w-12 bg-brand-gold" />

            <span className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-stone">
              Mannat Concierge
            </span>

            <span className="h-px w-12 bg-brand-gold" />
          </div>
        </div>
      </section>

      {/* Offerings */}
      <section className="relative border-b border-brand-border px-6 py-24 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <div className="flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-brand-gold" />
              <p className="text-caption">
                Our Offerings
              </p>
              <span className="h-px w-8 bg-brand-gold" />
            </div>

            <h2 className="mt-6 text-headline">
              Bespoke Hospitality Standards
            </h2>

            <p className="mt-6 text-body-lg">
              A carefully designed planning experience for
              accommodations, guest preferences and personalized
              event requirements.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            <FeatureCard
              icon={<Star size={24} />}
              title="Curated Lodging"
              description="Premium accommodation planning designed around comfort, privacy and an elevated guest experience."
            />

            <FeatureCard
              icon={<Award size={24} />}
              title="Gastronomy"
              description="Create personalized vegetarian and non-vegetarian meal preferences for every day of your stay."
            />

            <FeatureCard
              icon={<Shield size={24} />}
              title="Elite Management"
              description="A seamless booking workflow with clear status tracking and dedicated administrative review."
            />
          </div>
        </div>
      </section>

      {/* Dark Feature Section */}
      <section className="relative overflow-hidden bg-brand-obsidian px-6 py-24 text-white md:py-32">
        <div className="pointer-events-none absolute bottom-0 right-1/4 h-[500px] w-[500px] rounded-full bg-brand-gold/10 blur-[130px]" />

        <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-24">
          <div>
            <p className="text-caption">
              Exclusivity
            </p>

            <h2 className="mt-6 font-serif text-4xl font-light leading-tight text-white md:text-5xl">
              Tailored for Discerning Gathering Hosts
            </h2>

            <p className="mt-7 max-w-xl text-lg font-light leading-8 text-[#B5B5B5]">
              Every gathering tells a story. Mannat Events brings
              accommodation, event preferences and personalized
              planning together in one refined experience.
            </p>

            <div className="mt-9">
              <Link href={user ? '/booking' : '/signup'}>
                <Button
                  variant="outline"
                  className="border-brand-gold text-brand-gold"
                >
                  Begin Planning
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <DarkFeature
              number="01"
              title="Private Lodging"
              description="Comfortable accommodation planning designed around your event and guests."
            />

            <DarkFeature
              number="02"
              title="Curated Meals"
              description="Meal preferences organized clearly for every day of your stay."
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-b border-brand-border bg-white px-6 py-24 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-caption">
              Your Journey
            </p>

            <h2 className="mt-5 text-headline">
              Planning Made Effortless
            </h2>

            <p className="mt-5 text-body-lg">
              From your first selection to final confirmation,
              every step is designed to remain clear and simple.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            <JourneyStep
              number="01"
              title="Create Your Account"
              description="Sign in securely to begin planning and keep track of your bookings."
            />

            <JourneyStep
              number="02"
              title="Personalize Your Stay"
              description="Choose dates, guests, event preferences, rooms, meals and additional services."
            />

            <JourneyStep
              number="03"
              title="Submit & Track"
              description="Review your selections, submit your booking and follow its status from your dashboard."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden px-6 py-24 md:py-32">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[550px] w-[550px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-gold/10 blur-[120px]" />

        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <p className="text-caption">
            Begin Your Experience
          </p>

          <h2 className="mt-6 text-headline">
            Begin Planning Your Reservation
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-body-lg">
            Create your personalized booking and bring every
            detail of your stay together in one place.
          </p>

          <div className="mt-10">
            <Link href={user ? '/booking' : '/signup'}>
              <Button variant="gold" size="lg">
                Begin Planning
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-brand-border bg-white px-6 py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
          <p className="text-sm text-brand-stone">
            © {new Date().getFullYear()} Mannat Events. All rights reserved.
          </p>

          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-gold">
            Bespoke Hospitality Portal
          </p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="luxury-card rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-hover md:p-10">
      <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-brand-border bg-brand-cream text-brand-gold">
        {icon}
      </div>

      <h3 className="mt-7 font-serif text-2xl text-brand-obsidian">
        {title}
      </h3>

      <p className="mt-4 text-base leading-7 text-brand-stone">
        {description}
      </p>
    </div>
  )
}

function DarkFeature({
  number,
  title,
  description,
}: {
  number: string
  title: string
  description: string
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
      <p className="font-serif text-4xl font-light text-brand-gold">
        {number}
      </p>

      <h3 className="mt-6 text-lg font-semibold text-white">
        {title}
      </h3>

      <p className="mt-3 text-base font-light leading-7 text-[#B5B5B5]">
        {description}
      </p>
    </div>
  )
}

function JourneyStep({
  number,
  title,
  description,
}: {
  number: string
  title: string
  description: string
}) {
  return (
    <div className="border-t border-brand-border pt-7">
      <p className="font-serif text-3xl text-brand-gold">
        {number}
      </p>

      <h3 className="mt-5 font-serif text-2xl text-brand-obsidian">
        {title}
      </h3>

      <p className="mt-4 text-base leading-7 text-brand-stone">
        {description}
      </p>
    </div>
  )
}