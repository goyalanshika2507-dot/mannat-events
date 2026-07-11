'use client'

import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { BookingFormData } from '@/lib/types'
import { cn } from '@/lib/utils/cn'

const COLOURS = [
  {
    id: 'gold',
    title: 'Royal Gold',
    color: '#C9A84C',
  },
  {
    id: 'white',
    title: 'Classic White',
    color: '#F8F8F8',
  },
  {
    id: 'red',
    title: 'Royal Red',
    color: '#8B0000',
  },
  {
    id: 'blue',
    title: 'Royal Blue',
    color: '#1E3A8A',
  },
  {
    id: 'pastel',
    title: 'Pastel',
    color: '#EBC8C8',
  },
  {
    id: 'green',
    title: 'Emerald',
    color: '#047857',
  },
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
    <div className="space-y-8">

      <div>
        <h2 className="text-3xl font-light">
          Choose Theme Colour
        </h2>

        <p className="mt-3 text-[#737373]">
          Select your preferred event colour palette.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-5">

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
              'cursor-pointer p-6 border-2 transition-all hover:shadow-xl hover:-translate-y-1',

              selected === item.id
                ? 'border-[#C9A84C]'
                : 'border-transparent'
            )}
          >
            <div
              className="w-full h-24 rounded-xl mb-5 border"
              style={{
                backgroundColor: item.color,
              }}
            />

            <h3 className="text-lg font-medium">
              {item.title}
            </h3>

          </Card>

        ))}

      </div>

      <Button
        variant="secondary"
        onClick={onPrev}
      >
        Previous
      </Button>

    </div>
  )
}