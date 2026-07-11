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
    <div className="space-y-8 pb-24 md:pb-0">
      <div>
        <h2 className="text-3xl font-light text-[#1A1A1A]">Choose a Decoration Theme</h2>
        <p className="mt-3 text-[#737373]">Select the style you prefer for your event.</p>
      </div>

      {/* Grid container with optimized spacing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {THEMES.map((theme) => (
          <Card
            key={theme.id}
            as="button"
            onClick={() => onNext({ decoration_theme: theme.id })}
            className={cn(
              'w-full text-left cursor-pointer p-4 transition-all duration-300 border-2 hover:-translate-y-1 hover:shadow-lg',
              selected === theme.id ? 'border-[#C9A84C] shadow-md' : 'border-[#E8E5E0]'
            )}
          >
            {/* Image container with fixed aspect ratio */}
            <div className="relative w-full h-48 overflow-hidden rounded-lg">
              <img
                src={theme.image}
                alt={theme.title}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Theme+Image'
                }}
              />
            </div>

            <div className="pt-4 px-2">
              <h3 className="text-lg font-medium text-[#1A1A1A]">{theme.title}</h3>
            </div>
          </Card>
        ))}
      </div>

      {/* Desktop Previous Button */}
      <div className="hidden md:flex justify-start pt-4">
        <Button type="button" variant="secondary" onClick={onPrev}>
          Previous
        </Button>
      </div>

      {/* Mobile Sticky Bottom Navigation */}
      <div className="fixed md:hidden bottom-0 left-0 right-0 z-50 border-t border-[#E8E5E0] bg-white/95 backdrop-blur-md px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div className="max-w-lg mx-auto">
          <Button type="button" variant="secondary" size="lg" onClick={onPrev} className="w-full">
            Previous
          </Button>
        </div>
      </div>
    </div>
  )
}