'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Building2, Star, Check, MapPin, ArrowRight, ShieldCheck, FileSpreadsheet, Layers, CheckCircle2, XCircle } from 'lucide-react'
import { BookingFormData, HotelComparisonItem } from '@/lib/types'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils/cn'

interface Props {
  data: Partial<BookingFormData>
  onSelectHotel: (hotel: HotelComparisonItem) => void
  onPrev: () => void
  isSubmitting: boolean
}

// Hotel base definitions
const HOTEL_DEFINITIONS = [
  {
    id: 'taj-hotel',
    name: 'Taj Hotel & Convention Centre',
    star_rating: 5,
    image_url: '/venue_palace.jpg',
    location: 'Taj East Gate Road, Agra',
    room_category: 'Deluxe Taj Facing Rooms',
    venue_capacity: 'Up to 500 Guests',
    roomRate: 12000,
    multiplier: 1.3,
    ballroomSqFt: '12,500 sq. ft.',
    lawnCapacity: '750 Guests',
    liveStations: '8 Live Stations included',
    bridalSuiteNights: '2 Nights Complimentary',
    djCutoff: '11:30 PM (Indoor Ballroom)',
    amenities: ['Infiniti Rooftop Pool', 'Taj Mahal View Terrace', 'Spa & Wellness', 'Valet Parking'],
    inclusions: ['Breakfast included', 'Stage & Sound Setup', 'Event Manager Support'],
    exclusions: ['Alcohol (chargeable on actuals)', 'External Decorator Fee'],
    tax_info: 'Includes 18% GST',
  },
  {
    id: 'itc-mughal',
    name: 'ITC Mughal, Luxury Collection',
    star_rating: 5,
    image_url: '/royal.jpg',
    location: 'Fatehabad Road, Agra',
    room_category: 'Mughal Superior Rooms',
    venue_capacity: 'Up to 600 Guests',
    roomRate: 9500,
    multiplier: 1.12,
    ballroomSqFt: '15,000 sq. ft.',
    lawnCapacity: '1,000 Guests',
    liveStations: '6 Live Stations included',
    bridalSuiteNights: '2 Nights Complimentary',
    djCutoff: '11:00 PM (Outdoor Gardens)',
    amenities: ['Kaya Kalp Spa', '35 Acres Mughal Gardens', 'Multiple Lawns', 'Helipad Access'],
    inclusions: ['Breakfast included', 'Garden Lighting', 'Bridal Suite Upgrade'],
    exclusions: ['Liquor License Fee'],
    tax_info: 'Includes 18% GST',
  },
  {
    id: 'courtyard-marriott',
    name: 'Courtyard by Marriott',
    star_rating: 5,
    image_url: '/wedding_feast.jpg',
    location: 'Fatehabad Road, Agra',
    room_category: 'Executive Deluxe Rooms',
    venue_capacity: 'Up to 350 Guests',
    roomRate: 7200,
    multiplier: 0.92,
    ballroomSqFt: '8,200 sq. ft.',
    lawnCapacity: '400 Guests',
    liveStations: '5 Live Stations included',
    bridalSuiteNights: '1 Night Complimentary',
    djCutoff: '10:30 PM (Ballroom)',
    amenities: ['Outdoor Pool', 'Grand Ballroom', 'Fitness Centre', '24h Concierge'],
    inclusions: ['Breakfast included', 'Basic AV Setup', 'Complimentary Room Upgrade'],
    exclusions: ['Late Night DJ Clearance'],
    tax_info: 'Includes 18% GST',
  },
]

// Price calculation helpers
const MENU_RATES: Record<string, number> = {
  'Silver Banquet Menu': 1400,
  'Gold Royal Feast Menu': 2100,
  'Diamond Grand Buffet Menu': 2800,
  'Imperial Taj Special Menu': 3600,
  // New Banquet Packages
  'Premium Veg Banquet': 2000,
  'Executive Veg Banquet': 2500,
  'Platinum Veg Banquet': 3000,
  'Premium Non-Veg Banquet': 2650,
  'Executive Non-Veg Banquet': 3150,
  'Platinum Non-Veg Banquet': 3650,
}

const DECOR_RATES: Record<string, number> = {
  silver: 280000,
  gold: 480000,
  platinum: 750000,
  luxury: 1100000,
}

export function StepHotelComparison({ data, onSelectHotel, onPrev, isSubmitting }: Props) {
  const [activeTab, setActiveTab] = useState<'cards' | 'financial' | 'specs'>('cards')

  const duration = data.day_plans?.length ?? 1
  const decorTier = data.decoration_package ?? 'gold'
  const decorBasePrice = DECOR_RATES[decorTier] ?? 480000

  // Calculate detailed financial breakdown and package totals for each hotel
  const hotelCalculations = HOTEL_DEFINITIONS.map(h => {
    let totalRooms = 0
    let totalCatering = 0
    let totalLunchGuests = 0
    let totalDinnerGuests = 0

    if (data.day_plans && data.day_plans.length > 0) {
      for (const p of data.day_plans) {
        totalRooms += (p.rooms ?? 1)
        
        const lunchGuests = p.lunch?.guest_count ?? p.guest_count ?? 50
        const dinnerGuests = p.dinner?.guest_count ?? p.guest_count ?? 50
        totalLunchGuests += lunchGuests
        totalDinnerGuests += dinnerGuests
        
        const lunchPkg = p.lunch?.menu_item_names?.[0] ?? 'Gold Royal Feast Menu'
        const dinnerPkg = p.dinner?.menu_item_names?.[0] ?? 'Gold Royal Feast Menu'
        
        const lunchPlateRate = MENU_RATES[lunchPkg] ?? 2100
        const dinnerPlateRate = MENU_RATES[dinnerPkg] ?? 2400
        
        totalCatering += (lunchGuests * lunchPlateRate) + (dinnerGuests * dinnerPlateRate)
      }
    } else {
      totalRooms = 10 * duration
      totalCatering = 150 * 2000 * duration
      totalLunchGuests = 100 * duration
      totalDinnerGuests = 150 * duration
    }

    const roomCost = totalRooms * h.roomRate
    const cateringCost = Math.round(totalCatering * h.multiplier)
    const decorCost = Math.round(decorBasePrice * (h.multiplier * 0.95))
    const logisticsCost = Math.round((roomCost + cateringCost + decorCost) * 0.04)
    
    const subtotal = roomCost + cateringCost + decorCost + logisticsCost
    const gstTax = Math.round(subtotal * 0.18)
    const rawTotal = subtotal + gstTax

    const finalPrice = Math.ceil(rawTotal / 5000) * 5000
    const priceDisplay = `₹${finalPrice.toLocaleString('en-IN')}`

    const hotelItem: HotelComparisonItem = {
      id: h.id,
      name: h.name,
      star_rating: h.star_rating,
      image_url: h.image_url,
      location: h.location,
      package_price: finalPrice,
      price_display: priceDisplay,
      room_category: h.room_category,
      venue_capacity: h.venue_capacity,
      catering_details: `${duration}-Day Customized Catering (Lunch & Dinner)`,
      amenities: h.amenities,
      inclusions: h.inclusions,
      exclusions: h.exclusions,
      tax_info: h.tax_info,
    }

    return {
      def: h,
      item: hotelItem,
      roomCost,
      cateringCost,
      decorCost,
      logisticsCost,
      gstTax,
      totalRooms,
      totalLunchGuests,
      totalDinnerGuests,
      finalPrice,
      priceDisplay,
    }
  })

  const hotelsWithCalculatedPrices = hotelCalculations.map(c => c.item)

  const [selectedHotelId, setSelectedHotelId] = useState<string>(
    data.selected_hotel?.id ?? hotelsWithCalculatedPrices[0].id
  )

  const selectedHotel = hotelsWithCalculatedPrices.find(h => h.id === selectedHotelId) || hotelsWithCalculatedPrices[0]

  function handleSubmitEnquiry() {
    onSelectHotel(selectedHotel)
  }

  const firstDay = data.day_plans?.[0]
  const totalRoomsPerDay = firstDay?.rooms ?? 10
  const avgGuests = firstDay ? Math.max(firstDay.lunch?.guest_count ?? 50, firstDay.dinner?.guest_count ?? 50) : 100

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ type: 'spring', stiffness: 280, damping: 28 }}
      className="pb-28 md:pb-0"
    >
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <span className="px-3 py-1 rounded-full bg-[#F5EDD6] border border-[#E8D9A8] text-xs font-bold tracking-widest text-[#A08040] uppercase flex items-center gap-1.5">
          <ShieldCheck size={14} className="text-[#C5A85C]" />
          Verified Dynamic Comparison &amp; Detailed Quotation
        </span>

        {/* View Mode Tabs */}
        <div className="flex bg-[#F5F0E8] p-1 rounded-xl border border-[#E8E2D8] text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('cards')}
            className={cn(
              'px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all',
              activeTab === 'cards' ? 'bg-white text-[#1A1A1A] shadow-xs' : 'text-[#737373] hover:text-[#1A1A1A]'
            )}
          >
            <Layers size={13} /> Cards View
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('financial')}
            className={cn(
              'px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all',
              activeTab === 'financial' ? 'bg-white text-[#1A1A1A] shadow-xs' : 'text-[#737373] hover:text-[#1A1A1A]'
            )}
          >
            <FileSpreadsheet size={13} /> Line-Item Breakdown
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('specs')}
            className={cn(
              'px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all',
              activeTab === 'specs' ? 'bg-white text-[#1A1A1A] shadow-xs' : 'text-[#737373] hover:text-[#1A1A1A]'
            )}
          >
            <Building2 size={13} /> Venue Specs Matrix
          </button>
        </div>
      </div>

      <h2 className="text-headline mb-1">Hotel Package Comparison Matrix</h2>
      <p className="text-body text-[#737373] mb-8">
        Compare detailed itemized costs, venue specifications, catering specs, and inclusions across Agra&apos;s luxury 5-star hotels.
      </p>

      {/* Summary Pill */}
      <div className="rounded-2xl border border-[#E8E2D8] bg-white p-4 mb-8 flex flex-wrap items-center justify-between gap-4 text-xs font-semibold text-[#737373]">
        <div className="flex items-center gap-2">
          <Building2 size={16} className="text-[#C5A85C]" />
          <span>Duration: <strong>{duration} Days</strong></span>
        </div>
        <div>
          <span>Rooms: <strong>{totalRoomsPerDay} Rooms/day</strong></span>
        </div>
        <div>
          <span>Guests: <strong>~{avgGuests} Guests/event</strong></span>
        </div>
        <div>
          <span>Decor: <strong className="capitalize text-[#C5A85C]">{decorTier} Tier</strong></span>
        </div>
      </div>

      {/* ── TAB 1: CARDS VIEW ── */}
      {activeTab === 'cards' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {hotelsWithCalculatedPrices.map((hotel) => {
            const isSel = selectedHotelId === hotel.id
            return (
              <div
                key={hotel.id}
                onClick={() => setSelectedHotelId(hotel.id)}
                className={cn(
                  'rounded-3xl border transition-all duration-300 bg-white overflow-hidden flex flex-col cursor-pointer',
                  isSel
                    ? 'border-[#C5A85C] ring-2 ring-[#C5A85C] shadow-xl scale-[1.01]'
                    : 'border-[#E8E2D8] hover:border-[#C5A85C]/50 shadow-sm'
                )}
              >
                {/* Hotel Banner */}
                <div className="relative h-44 w-full bg-[#F5EDD6]">
                  <img src={hotel.image_url} alt={hotel.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  
                  {isSel && (
                    <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#C5A85C] text-white flex items-center gap-1 shadow-sm">
                      <Check size={12} strokeWidth={3} /> Selected Choice
                    </span>
                  )}

                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="flex items-center gap-1 text-amber-400 mb-1">
                      {Array.from({ length: hotel.star_rating }).map((_, i) => (
                        <Star key={i} size={12} fill="currentColor" />
                      ))}
                    </div>
                    <h3 className="text-base font-bold leading-tight">{hotel.name}</h3>
                    <p className="text-xs text-white/80 flex items-center gap-1 mt-0.5">
                      <MapPin size={10} /> {hotel.location}
                    </p>
                  </div>
                </div>

                {/* Dynamic Price Header */}
                <div className="p-5 border-b border-[#F0EDE9] bg-[#FDFCFA] text-center">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#737373]">Calculated Package Price</span>
                  <p className="text-2xl font-bold text-[#1A1A1A] mt-0.5" style={{ color: '#C5A85C' }}>
                    {hotel.price_display}
                  </p>
                  <span className="text-[10px] text-[#A8A8A8]">{hotel.tax_info}</span>
                </div>

                {/* Comparison Features */}
                <div className="p-5 space-y-4 text-xs flex-1">
                  <div>
                    <span className="font-bold text-[#1A1A1A] block">Room Category</span>
                    <span className="text-[#737373]">{hotel.room_category}</span>
                  </div>

                  <div>
                    <span className="font-bold text-[#1A1A1A] block">Venue Capacity</span>
                    <span className="text-[#737373]">{hotel.venue_capacity}</span>
                  </div>

                  <div>
                    <span className="font-bold text-[#1A1A1A] block">Catering Inclusions</span>
                    <span className="text-[#737373]">{hotel.catering_details}</span>
                  </div>

                  <div>
                    <span className="font-bold text-[#1A1A1A] block mb-1">Top Inclusions</span>
                    <ul className="space-y-1">
                      {hotel.inclusions.map((inc) => (
                        <li key={inc} className="flex items-center gap-1.5 text-[#737373]">
                          <Check size={12} className="text-green-600 shrink-0" />
                          {inc}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Select Button */}
                <div className="p-5 border-t border-[#F0EDE9] bg-white">
                  <Button
                    type="button"
                    variant={isSel ? 'gold' : 'secondary'}
                    size="md"
                    onClick={() => setSelectedHotelId(hotel.id)}
                    className="w-full"
                  >
                    {isSel ? 'Selected' : 'Select This Hotel'}
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ── TAB 2: DETAILED FINANCIAL LINE-ITEM BREAKDOWN TABLE ── */}
      {activeTab === 'financial' && (
        <div className="rounded-3xl border border-[#E8E2D8] bg-white overflow-hidden shadow-sm mb-8">
          <div className="px-6 py-4 bg-[#FDFCFA] border-b border-[#F0EDE9] flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#1A1A1A]">
              Itemized Financial Breakdown Matrix
            </h3>
            <span className="text-xs text-[#737373]">Click hotel header to select</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F8F5F0] border-b border-[#E8E2D8]">
                  <th className="p-4 font-bold text-[#1A1A1A] w-1/4">Cost Component</th>
                  {hotelCalculations.map((calc) => (
                    <th
                      key={calc.def.id}
                      onClick={() => setSelectedHotelId(calc.def.id)}
                      className={cn(
                        'p-4 font-bold text-center cursor-pointer transition-colors',
                        selectedHotelId === calc.def.id ? 'bg-[#F0E6CE] text-[#1A1A1A]' : 'text-[#737373] hover:bg-[#F3EFE6]'
                      )}
                    >
                      <div className="text-sm font-extrabold">{calc.def.name}</div>
                      <div className="text-[10px] text-[#A08040] font-bold mt-0.5">{calc.priceDisplay}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EDE9]">
                <tr>
                  <td className="p-4 font-semibold text-[#1A1A1A]">
                    🏨 Accommodation ({hotelCalculations[0].totalRooms} Room-Nights)
                  </td>
                  {hotelCalculations.map((c) => (
                    <td key={c.def.id} className="p-4 text-center font-medium text-[#737373]">
                      ₹{c.roomCost.toLocaleString('en-IN')}
                      <span className="block text-[10px] text-[#A8A8A8]">(@ ₹{c.def.roomRate.toLocaleString('en-IN')}/night)</span>
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-4 font-semibold text-[#1A1A1A]">
                    🍽️ Customized Event Catering (Lunch + Dinner)
                  </td>
                  {hotelCalculations.map((c) => (
                    <td key={c.def.id} className="p-4 text-center font-medium text-[#737373]">
                      ₹{c.cateringCost.toLocaleString('en-IN')}
                      <span className="block text-[10px] text-[#A8A8A8]">({duration} Days Custom Buffets)</span>
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-4 font-semibold text-[#1A1A1A]">
                    🌺 Décor &amp; Lighting ({decorTier.toUpperCase()} Package)
                  </td>
                  {hotelCalculations.map((c) => (
                    <td key={c.def.id} className="p-4 text-center font-medium text-[#737373]">
                      ₹{c.decorCost.toLocaleString('en-IN')}
                      <span className="block text-[10px] text-[#A8A8A8]">(Stage, Mandap &amp; Floral)</span>
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-4 font-semibold text-[#1A1A1A]">
                    🎷 Event Execution &amp; Sound Logistics
                  </td>
                  {hotelCalculations.map((c) => (
                    <td key={c.def.id} className="p-4 text-center font-medium text-[#737373]">
                      ₹{c.logisticsCost.toLocaleString('en-IN')}
                    </td>
                  ))}
                </tr>

                <tr className="bg-[#FAF7F2]">
                  <td className="p-4 font-semibold text-[#1A1A1A]">
                    📑 Government Taxes &amp; GST (18%)
                  </td>
                  {hotelCalculations.map((c) => (
                    <td key={c.def.id} className="p-4 text-center font-medium text-[#737373]">
                      ₹{c.gstTax.toLocaleString('en-IN')}
                    </td>
                  ))}
                </tr>

                <tr className="bg-[#F5EDD6] font-bold text-sm">
                  <td className="p-4 text-[#1A1A1A]">
                    Total Calculated Package Quote
                  </td>
                  {hotelCalculations.map((c) => (
                    <td key={c.def.id} className="p-4 text-center text-[#C5A85C]">
                      {c.priceDisplay}
                      {selectedHotelId === c.def.id && (
                        <span className="block text-[10px] text-green-700 font-bold uppercase mt-0.5">✓ Selected</span>
                      )}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── TAB 3: VENUE SPECS & AMENITIES COMPARISON MATRIX ── */}
      {activeTab === 'specs' && (
        <div className="rounded-3xl border border-[#E8E2D8] bg-white overflow-hidden shadow-sm mb-8">
          <div className="px-6 py-4 bg-[#FDFCFA] border-b border-[#F0EDE9]">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#1A1A1A]">
              Banquet Specs &amp; Technical Specifications
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F8F5F0] border-b border-[#E8E2D8]">
                  <th className="p-4 font-bold text-[#1A1A1A] w-1/4">Specification</th>
                  {hotelCalculations.map((calc) => (
                    <th key={calc.def.id} className="p-4 font-bold text-center text-[#1A1A1A]">
                      {calc.def.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EDE9]">
                <tr>
                  <td className="p-4 font-semibold text-[#1A1A1A]">Grand Ballroom Area</td>
                  {hotelCalculations.map((c) => (
                    <td key={c.def.id} className="p-4 text-center text-[#737373]">{c.def.ballroomSqFt}</td>
                  ))}
                </tr>

                <tr>
                  <td className="p-4 font-semibold text-[#1A1A1A]">Outdoor Lawn Capacity</td>
                  {hotelCalculations.map((c) => (
                    <td key={c.def.id} className="p-4 text-center text-[#737373]">{c.def.lawnCapacity}</td>
                  ))}
                </tr>

                <tr>
                  <td className="p-4 font-semibold text-[#1A1A1A]">Live Food Counters</td>
                  {hotelCalculations.map((c) => (
                    <td key={c.def.id} className="p-4 text-center text-[#737373]">{c.def.liveStations}</td>
                  ))}
                </tr>

                <tr>
                  <td className="p-4 font-semibold text-[#1A1A1A]">Bridal Suite Nights</td>
                  {hotelCalculations.map((c) => (
                    <td key={c.def.id} className="p-4 text-center text-[#737373]">{c.def.bridalSuiteNights}</td>
                  ))}
                </tr>

                <tr>
                  <td className="p-4 font-semibold text-[#1A1A1A]">DJ &amp; Sound Permit Limit</td>
                  {hotelCalculations.map((c) => (
                    <td key={c.def.id} className="p-4 text-center text-[#737373]">{c.def.djCutoff}</td>
                  ))}
                </tr>

                <tr>
                  <td className="p-4 font-semibold text-[#1A1A1A]">Valet Parking &amp; Access</td>
                  {hotelCalculations.map((c) => (
                    <td key={c.def.id} className="p-4 text-center text-[#737373]">
                      <CheckCircle2 size={15} className="inline text-green-600 mr-1" /> Unlimited Valet
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Nav */}
      <div className="hidden md:flex justify-between items-center mt-10 pt-6 border-t border-[#E8E2D8]">
        <Button variant="secondary" size="lg" onClick={onPrev}>Previous</Button>
        <Button
          size="lg"
          variant="gold"
          loading={isSubmitting}
          onClick={handleSubmitEnquiry}
          className="flex items-center gap-2"
        >
          Submit Final Enquiry ({selectedHotel.name}) <ArrowRight size={16} />
        </Button>
      </div>

      <div className="fixed md:hidden bottom-0 left-0 right-0 z-50 border-t border-[#E8E2D8] bg-white/95 backdrop-blur-md px-4 py-3">
        <div className="max-w-lg mx-auto flex gap-3">
          <Button variant="secondary" size="lg" onClick={onPrev} className="flex-1">Previous</Button>
          <Button
            size="lg"
            variant="gold"
            loading={isSubmitting}
            onClick={handleSubmitEnquiry}
            className="flex-1"
          >
            Submit Enquiry →
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
