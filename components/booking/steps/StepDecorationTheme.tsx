'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Check, Info, Crown, Gem, Award, Loader2 } from 'lucide-react'
import { BookingFormData, DecorationPackageTier } from '@/lib/types'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils/cn'

interface Props {
  data: Partial<BookingFormData>
  onNext: (tier: DecorationPackageTier, title: string) => void
  onPrev: () => void
}

interface DecorPkg {
  id: DecorationPackageTier
  title: string
  subtitle: string
  badge: string
  features: string[]
  image_url: string
  price: number
  is_active: boolean
}

export function StepDecorationTheme({ data, onNext, onPrev }: Props) {
  const [selectedTier, setSelectedTier] = useState<DecorationPackageTier | null>(
    data.decoration_package ?? null
  )
  const [packages, setPackages] = useState<DecorPkg[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const hotelId = data.selected_hotel?.id || 'mannat-events'
    fetch(`/api/config/decoration-packages?hotel_id=${encodeURIComponent(hotelId)}`)
      .then(res => res.json())
      .then(decorData => {
        if (Array.isArray(decorData)) {
          setPackages(decorData)
        }
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to load decoration packages:', err)
        setLoading(false)
      })
  }, [data.selected_hotel?.id])

  function handleContinue() {
    if (!selectedTier) return
    const pkg = packages.find(p => p.id === selectedTier)
    onNext(selectedTier, pkg?.title ?? 'Decoration Package')
  }

  const getIcon = (id: string) => {
    if (id === 'silver') return <Award size={20} className="text-slate-500" />
    if (id === 'gold') return <Sparkles size={20} className="text-amber-500" />
    if (id === 'platinum') return <Gem size={20} className="text-cyan-600" />
    return <Crown size={20} className="text-[#C5A85C]" />
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-3">
        <Loader2 className="animate-spin text-[#C5A85C]" size={36} />
        <p className="text-sm text-[#737373] font-light">Loading decoration options...</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ type: 'spring', stiffness: 280, damping: 28 }}
      className="pb-28 md:pb-0"
    >
      <div className="mb-6">
        <span className="px-3 py-1 rounded-full bg-[#F5EDD6] border border-[#E8D9A8] text-xs font-bold tracking-widest text-[#A08040] uppercase">
          Step 3: Decor
        </span>
      </div>

      <h2 className="text-headline mb-1">Decoration Package Selection</h2>
      <p className="text-body text-[#737373] mb-6">
        Select your base decoration tier for your destination wedding setup in Agra.
      </p>

      {/* Mandatory Disclaimer Banner */}
      <div className="rounded-2xl border border-[#E8D9A8] bg-[#FDFAF3] p-4 sm:p-5 mb-8 flex items-start gap-3.5 shadow-xs">
        <Info size={20} className="text-[#C5A85C] shrink-0 mt-0.5" />
        <div className="text-xs text-[#907030] leading-relaxed">
          <strong className="block text-sm font-semibold text-[#1A1A1A] mb-1">
            Disclaimer: Base Package Selection
          </strong>
          You are currently selecting the standard decoration package. Final decoration details such as colour palettes, floral arrangements, stage design, lighting, and other décor customizations can be finalized later according to your preferences. At this stage, you are only selecting the base decoration package.
        </div>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {packages.map((pkg) => {
          const isSel = selectedTier === pkg.id
          return (
            <button
              key={pkg.id}
              type="button"
              onClick={() => setSelectedTier(pkg.id)}
              className={cn(
                'group relative text-left rounded-3xl overflow-hidden border transition-all duration-300 bg-white cursor-pointer',
                isSel
                  ? 'border-[#C5A85C] ring-2 ring-[#C5A85C] shadow-lg scale-[1.01]'
                  : 'border-[#E8E2D8] hover:border-[#C5A85C]/60 shadow-sm hover:shadow-md'
              )}
            >
              {/* Image & Badge */}
              <div className="relative h-44 w-full bg-[#F5EDD6] overflow-hidden">
                <img
                  src={pkg.image_url}
                  alt={pkg.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    if (!target.src.endsWith('/floral.jpg')) {
                      target.src = '/floral.jpg'
                    }
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-white/90 backdrop-blur-md text-[#1A1A1A]">
                  {pkg.badge}
                </span>

                {isSel && (
                  <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#C5A85C] text-white flex items-center justify-center shadow-md">
                    <Check size={16} strokeWidth={3} />
                  </div>
                )}

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="flex items-center gap-2 mb-1">
                    {getIcon(pkg.id)}
                    <h3 className="text-lg font-bold">{pkg.title}</h3>
                  </div>
                  <p className="text-xs text-white/80">{pkg.subtitle}</p>
                </div>
              </div>

              {/* Features List */}
              <div className="p-5">
                <ul className="space-y-2">
                  {pkg.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-2 text-xs text-[#737373]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C5A85C] shrink-0" />
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>
            </button>
          )
        })}
      </div>

      {/* Nav */}
      <div className="hidden md:flex justify-between mt-10 pt-6 border-t border-[#E8E2D8]">
        <Button variant="secondary" size="lg" onClick={onPrev}>Previous</Button>
        <Button size="lg" variant="gold" onClick={handleContinue} disabled={!selectedTier}>
          {selectedTier ? 'Click to See Prices' : 'Select a Decor Package'}
        </Button>
      </div>

      <div className="fixed md:hidden bottom-0 left-0 right-0 z-50 border-t border-[#E8E2D8] bg-white/95 backdrop-blur-md px-4 py-3">
        <div className="max-w-lg mx-auto flex gap-3">
          <Button variant="secondary" size="lg" onClick={onPrev} className="flex-1">Previous</Button>
          <Button size="lg" variant="gold" onClick={handleContinue} disabled={!selectedTier} className="flex-1">
            {selectedTier ? 'See Prices →' : 'Select a Package'}
          </Button>
        </div>
      </div>
    </motion.div>
  )
}