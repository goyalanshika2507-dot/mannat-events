'use client'

import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { BookingFormData } from '@/lib/types'
import { cn } from '@/lib/utils/cn'

const THEMES = [
  { id: 'royal', title: 'Royal Luxury', image: '/royal.jpg' },      
  { id: 'floral', title: 'Floral Elegance', image: '/floral.jpg' },
  { id: 'modern', title: 'Modern Minimalist', image: '/modern.jpg' },
  { id: 'traditional', title: 'Traditional Indian', image: '/traditional.jpg' },
]

interface Props {
  data: Partial<BookingFormData>
  onNext: (value: { decoration_theme: string }) => void
  onPrev: () => void
}

export function StepDecorationTheme({ data, onNext, onPrev }: Props) {
  const selected = data.decoration_theme ?? ''

  return (
  <div className="pb-24 md:pb-0">
    {/* Section Introduction */}
    <div className="mb-8">
      <h2 className="text-2xl md:text-3xl font-serif font-medium text-[#1A1A1A]">
        Choose a Decoration Theme
      </h2>

      <p className="mt-3 text-base text-[#737373] leading-relaxed">
        Select the visual style that best reflects your event.
      </p>
    </div>

    {/* Theme Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {THEMES.map((theme) => (
        <Card
          key={theme.id}
          as="button"
          onClick={() =>
            onNext({ decoration_theme: theme.id })
          }
          className={cn(
            'group w-full text-left cursor-pointer overflow-hidden p-0 rounded-2xl border transition-all duration-300',
            'hover:-translate-y-0.5 hover:shadow-md',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A85C] focus-visible:ring-offset-2',
            selected === theme.id
              ? 'border-[#C5A85C] shadow-sm'
              : 'border-[#E8E2D8]'
          )}
        >
          {/* Theme Image */}
          <div className="relative w-full aspect-[16/10] overflow-hidden bg-[#F5F2ED]">
            <img
              src={theme.image}
              alt={theme.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />

            {selected === theme.id && (
              <div className="absolute inset-0 ring-2 ring-inset ring-[#C5A85C]" />
            )}
          </div>

          {/* Theme Information */}
          <div className="px-6 py-5 bg-white">
            <h3 className="text-lg md:text-xl font-serif font-medium text-[#1A1A1A]">
              {theme.title}
            </h3>
          </div>
        </Card>
      ))}
    </div>

    {/* Desktop Navigation */}
    <div className="hidden md:flex justify-start mt-10 pt-6 border-t border-[#E8E2D8]">
      <Button
        type="button"
        variant="secondary"
        size="lg"
        onClick={onPrev}
      >
        Previous
      </Button>
    </div>

    {/* Mobile Navigation */}
    <div className="fixed md:hidden bottom-0 left-0 right-0 z-50 border-t border-[#E8E2D8] bg-white/95 backdrop-blur-md px-5 py-4 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
      <Button
        type="button"
        variant="secondary"
        size="lg"
        onClick={onPrev}
        className="w-full"
      >
        Previous
      </Button>
    </div>
  </div>
)
}