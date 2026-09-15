import { getLocalDb } from '@/lib/supabase/mockDb'

export interface CalculationInput {
  check_in?: string
  check_out?: string
  day_plans?: Array<{
    day?: number
    rooms?: number
    guest_count?: number
    lunch?: {
      menu_config?: { packageId?: string; packageName?: string }
      type?: 'veg' | 'non-veg'
      guest_count?: number
      menu_item_names?: string[]
    }
    dinner?: {
      menu_config?: { packageId?: string; packageName?: string }
      type?: 'veg' | 'non-veg'
      guest_count?: number
      menu_item_names?: string[]
    }
  }>
  selected_hotel?: {
    id: string
    name?: string
  } | null
  decoration_package?: string
  package_price?: number
  decoration_price?: number
  total_price?: number
}

export interface CalculationResult {
  valid: boolean
  error?: string
  cateringTotal: number
  decorTotal: number
  roomTotal: number
  logisticsTotal: number
  gstTotal: number
  grandTotal: number
  priceDisplay: string
  breakdown: {
    totalRooms: number
    totalLunchGuests: number
    totalDinnerGuests: number
    details: Array<{
      day: number
      lunchPkg: string
      lunchGuests: number
      lunchRate: number
      dinnerPkg: string
      dinnerGuests: number
      dinnerRate: number
    }>
  }
}

// Fallback Hotel Specs if DB doesn't specify room_rate
const FALLBACK_HOTEL_SPECS: Record<string, { name: string; roomRate: number }> = {
  'mannat-events': { name: 'Mannat Events', roomRate: 8000 },
  'taj-hotel': { name: 'Taj Hotel & Convention Centre', roomRate: 12000 },
  'itc-mughal': { name: 'ITC Mughal, Luxury Collection', roomRate: 9500 },
  'courtyard-marriott': { name: 'Courtyard by Marriott', roomRate: 7200 },
}

/**
 * BACKEND AUTHORITATIVE PRICE CALCULATOR (HOTEL-SPECIFIC)
 * 
 * FORMULA & BUSINESS RULES:
 * 1. Selected Hotel ID resolves the hotel-specific packages from DB (banquet_packages & decoration_packages).
 * 2. Catering Total = Sum over all functions (Guest Count × Hotel-Specific Package Per-Head Price).
 * 3. Decoration Total = Hotel-Specific Decoration Price (0 if no decoration tier selected).
 * 4. Room Total = Total Rooms × Hotel Room Rate (0 if no rooms selected).
 * 5. Grand Total = Catering Total + Decoration Total + Room Total.
 * 6. Client-sent prices (package_price, total_price, decoration_price, etc.) are 100% IGNORED.
 * 7. Prices in database are tax-inclusive as configured. No arbitrary multipliers or GST double-additions.
 */
export function calculateBookingEstimate(input: CalculationInput): CalculationResult {
  const db = getLocalDb()

  const allBanquetPkgs: any[] = db.banquet_packages ?? []
  const allDecorPkgs: any[] = db.decoration_packages ?? []
  const allHotels: any[] = db.hotels ?? []

  // 1. Resolve selected hotel
  const hotelId = input.selected_hotel?.id ?? 'mannat-events'
  const hotelRecord = allHotels.find((h: any) => h.id === hotelId)

  // Validate hotel active state if hotel record exists
  if (hotelRecord && hotelRecord.is_active === false) {
    return {
      valid: false,
      error: `Selected hotel '${hotelRecord.name || hotelId}' is currently inactive.`,
      cateringTotal: 0,
      decorTotal: 0,
      roomTotal: 0,
      logisticsTotal: 0,
      gstTotal: 0,
      grandTotal: 0,
      priceDisplay: '₹0',
      breakdown: { totalRooms: 0, totalLunchGuests: 0, totalDinnerGuests: 0, details: [] }
    }
  }

  const roomRate = Number(hotelRecord?.room_rate ?? FALLBACK_HOTEL_SPECS[hotelId]?.roomRate ?? 8000)

  // Filter packages strictly by hotel_id
  const hotelBanquetPkgs = allBanquetPkgs.filter((bp: any) => bp.hotel_id === hotelId)
  const hotelDecorPkgs = allDecorPkgs.filter((dp: any) => dp.hotel_id === hotelId)

  // 2. Resolve decoration package for this hotel (0 if no decoration selected)
  let decorCost = 0
  let decorDef: any = null
  const selectedDecorTier = input.decoration_package?.trim()

  if (selectedDecorTier) {
    const decorId = selectedDecorTier.toLowerCase()
    decorDef = hotelDecorPkgs.find((d: any) => (d.id ?? '').toLowerCase() === decorId)

    if (decorDef) {
      if (decorDef.is_active === false) {
        return {
          valid: false,
          error: `Selected decoration package '${decorDef.title || decorId}' is currently inactive for ${hotelRecord?.name || hotelId}.`,
          cateringTotal: 0,
          decorTotal: 0,
          roomTotal: 0,
          logisticsTotal: 0,
          gstTotal: 0,
          grandTotal: 0,
          priceDisplay: '₹0',
          breakdown: { totalRooms: 0, totalLunchGuests: 0, totalDinnerGuests: 0, details: [] }
        }
      }
      decorCost = Number(decorDef.price) || 0
    }
  }

  // 3. Process day plans & calculate catering / room totals for this hotel
  const dayPlans = input.day_plans ?? []
  let totalRooms = 0
  let totalCatering = 0
  let totalLunchGuests = 0
  let totalDinnerGuests = 0
  const details: CalculationResult['breakdown']['details'] = []

  if (dayPlans.length > 0) {
    for (const p of dayPlans) {
      const dayNum = p.day ?? 1
      const rooms = p.rooms ?? 0
      totalRooms += rooms

      const lunchGuests = p.lunch?.guest_count ?? p.guest_count ?? 0
      const dinnerGuests = p.dinner?.guest_count ?? p.guest_count ?? 0

      totalLunchGuests += lunchGuests
      totalDinnerGuests += dinnerGuests

      // Lookup hotel-specific package price per head strictly matching hotel_id
      const findPkg = (pkgId?: string, pkgName?: string, type?: string) => {
        if (pkgId) {
          const found = hotelBanquetPkgs.find((bp: any) => bp.id === pkgId)
          if (found) return found
        }
        if (pkgName) {
          const found = hotelBanquetPkgs.find((bp: any) => bp.name.toLowerCase() === pkgName.toLowerCase())
          if (found) return found
        }
        const fallbackId = type === 'non-veg' ? 'non-veg-premium' : 'veg-premium'
        return hotelBanquetPkgs.find((bp: any) => bp.id === fallbackId) || hotelBanquetPkgs[0] || null
      }

      const lunchPkgObj = findPkg(p.lunch?.menu_config?.packageId, p.lunch?.menu_config?.packageName, p.lunch?.type)
      const dinnerPkgObj = findPkg(p.dinner?.menu_config?.packageId, p.dinner?.menu_config?.packageName, p.dinner?.type)

      const lunchRate = Number(lunchPkgObj?.price_per_head ?? 2000)
      const dinnerRate = Number(dinnerPkgObj?.price_per_head ?? 2000)

      totalCatering += (lunchGuests * lunchRate) + (dinnerGuests * dinnerRate)

      details.push({
        day: dayNum,
        lunchPkg: lunchPkgObj?.name ?? 'Standard Lunch',
        lunchGuests,
        lunchRate,
        dinnerPkg: dinnerPkgObj?.name ?? 'Standard Dinner',
        dinnerGuests,
        dinnerRate,
      })
    }
  }

  // 4. Calculate exact total
  const roomCost = totalRooms * roomRate
  const cateringCost = totalCatering
  const grandTotal = cateringCost + decorCost + roomCost
  const priceDisplay = `₹${grandTotal.toLocaleString('en-IN')}`

  return {
    valid: true,
    cateringTotal: cateringCost,
    decorTotal: decorCost,
    roomTotal: roomCost,
    logisticsTotal: 0,
    gstTotal: 0,
    grandTotal,
    priceDisplay,
    breakdown: {
      totalRooms,
      totalLunchGuests,
      totalDinnerGuests,
      details,
    }
  }
}
