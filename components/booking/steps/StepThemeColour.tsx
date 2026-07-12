'use client'

import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { BookingFormData } from '@/lib/types'
import { cn } from '@/lib/utils/cn'

const COLOURS = [
  { id: 'gold', title: 'Royal Gold', color: '#C9A84C' },
  { id: 'white', title: 'Classic White', color: '#F8F8F8' },
  { id: 'red', title: 'Royal Red', color: '#8B0000' },
  { id: 'blue', title: 'Royal Blue', color: '#1E3A8A' },
  { id: 'pastel', title: 'Pastel', color: '#EBC8C8' },
  { id: 'green', title: 'Emerald', color: '#047857' },
]

interface Props {
  data: Partial<BookingFormData>
  onNext: (value: { theme_colour: string }) => void
  onPrev: () => void
}

export function StepThemeColour({
  data,
  onNext,
  onPrev,
}: Props) {
  const selected = data.theme_colour

  return (
  <div className="pb-24 md:pb-0">
    {/* Section Introduction */}
    <div className="mb-8">
      <h2 className="text-2xl md:text-3xl font-serif font-medium text-[#1A1A1A]">
        Choose Theme Colour
      </h2>

      <p className="mt-3 text-base text-[#737373] leading-relaxed">
        Select the colour palette that best complements your event.
      </p>
    </div>

    {/* Colour Options */}
    <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
      {COLOURS.map((item) => (
        <Card
          key={item.id}
          as="button"
          onClick={() =>
            onNext({
              theme_colour: item.id,
            })
          }
          className={cn(
            'group w-full text-left cursor-pointer overflow-hidden p-0 rounded-2xl border transition-all duration-300',
            'hover:-translate-y-0.5 hover:shadow-md',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A85C] focus-visible:ring-offset-2',
            selected === item.id
              ? 'border-[#C5A85C] shadow-sm'
              : 'border-[#E8E2D8] bg-white'
          )}
        >
          {/* Colour Preview */}
          <div
            className="w-full h-28 md:h-32 border-b border-[#E8E2D8]"
            style={{
              backgroundColor: item.color,
            }}
          />

          {/* Colour Name */}
          <div className="px-5 py-4 bg-white">
            <h3 className="text-base md:text-lg font-serif font-medium text-[#1A1A1A]">
              {item.title}
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