import { NextRequest, NextResponse } from 'next/server'
import { mockSupabase, getLocalDb, saveLocalDb } from '@/lib/supabase/mockDb'
import { requireAdmin } from '@/lib/auth/guards'

export async function GET() {
  try {
    const db = getLocalDb()
    const hotels = db.hotels ?? []
    const sorted = [...hotels].sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    return NextResponse.json(sorted)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const guard = await requireAdmin(req)
  if (guard.error) return guard.error

  try {
    const body = await req.json()
    if (!body.name) {
      return NextResponse.json({ error: 'Hotel name is required' }, { status: 400 })
    }

    const id = body.id || body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    const db = getLocalDb()
    db.hotels = db.hotels ?? []

    if (db.hotels.some((h: any) => h.id === id)) {
      return NextResponse.json({ error: `Hotel with ID '${id}' already exists` }, { status: 400 })
    }

    const newHotel = {
      id,
      name: body.name,
      star_rating: body.star_rating ?? 5,
      image_url: body.image_url || '/venue_palace.jpg',
      location: body.location || 'Agra',
      room_category: body.room_category || 'Deluxe Rooms',
      venue_capacity: body.venue_capacity || 'Up to 500 Guests',
      room_rate: Number(body.room_rate ?? 10000),
      multiplier: Number(body.multiplier ?? 1.0),
      ballroom_sq_ft: body.ballroom_sq_ft || '10,000 sq. ft.',
      lawn_capacity: body.lawn_capacity || '500 Guests',
      live_stations: body.live_stations || '4 Live Stations included',
      bridal_suite_nights: body.bridal_suite_nights || '1 Night Complimentary',
      dj_cutoff: body.dj_cutoff || '11:00 PM',
      amenities: Array.isArray(body.amenities) ? body.amenities : ['Pool', 'Spa', 'Valet Parking'],
      inclusions: Array.isArray(body.inclusions) ? body.inclusions : ['Breakfast included'],
      exclusions: Array.isArray(body.exclusions) ? body.exclusions : ['Alcohol'],
      tax_info: body.tax_info || 'Includes 18% GST',
      is_active: body.is_active ?? true,
      sort_order: body.sort_order ?? (db.hotels.length + 1)
    }

    db.hotels.push(newHotel)

    // Seed 6 default packages for this new hotel with unique composite IDs
    const defaultPackages = [
      { baseId: 'veg-premium', name: 'Premium Veg Banquet', meal_type: 'veg', price_per_head: 2000, sort_order: 1 },
      { baseId: 'veg-executive', name: 'Executive Veg Banquet', meal_type: 'veg', price_per_head: 2500, sort_order: 2 },
      { baseId: 'veg-platinum', name: 'Platinum Veg Banquet', meal_type: 'veg', price_per_head: 3000, sort_order: 3 },
      { baseId: 'non-veg-premium', name: 'Premium Non-Veg Banquet', meal_type: 'non-veg', price_per_head: 2650, sort_order: 4 },
      { baseId: 'non-veg-executive', name: 'Executive Non-Veg Banquet', meal_type: 'non-veg', price_per_head: 3150, sort_order: 5 },
      { baseId: 'non-veg-platinum', name: 'Platinum Non-Veg Banquet', meal_type: 'non-veg', price_per_head: 3650, sort_order: 6 },
    ]

    db.banquet_packages = db.banquet_packages ?? []
    defaultPackages.forEach(p => {
      const { baseId, ...rest } = p
      db.banquet_packages.push({
        ...rest,
        id: baseId, // kept as baseId; uniqueness is by (id + hotel_id) composite
        hotel_id: id,
        tagline: `₹${p.price_per_head.toLocaleString('en-IN')} per head`,
        is_active: true,
        updated_at: new Date().toISOString()
      })
    })

    // Seed default decoration packages for this new hotel
    const defaultDecor = [
      { id: 'silver', title: 'Silver Package', subtitle: 'Standard Decor', price: 280000, sort_order: 1, image_url: '/wedding_mandap.png' },
      { id: 'gold', title: 'Gold Package', subtitle: 'Royal Aesthetics', price: 480000, sort_order: 2, image_url: '/royal.jpg' },
      { id: 'platinum', title: 'Platinum Package', subtitle: 'Opulent Palace', price: 750000, sort_order: 3, image_url: '/floral.jpg' },
      { id: 'luxury', title: 'Luxury Package', subtitle: 'Bespoke Theme', price: 1100000, sort_order: 4, image_url: '/venue_palace.png' }
    ]

    db.decoration_packages = db.decoration_packages ?? []
    defaultDecor.forEach(d => {
      db.decoration_packages.push({
        ...d,
        hotel_id: id,
        is_active: true,
        features: ['Stage setup', 'Lighting', 'Floral backdrop']
      })
    })

    saveLocalDb(db)
    return NextResponse.json(newHotel, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  const guard = await requireAdmin(req)
  if (guard.error) return guard.error

  try {
    const body = await req.json()
    const { id, ...rest } = body
    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })

    const db = getLocalDb()
    db.hotels = db.hotels ?? []
    const idx = db.hotels.findIndex((h: any) => h.id === id)

    if (idx === -1) {
      return NextResponse.json({ error: 'Hotel not found' }, { status: 404 })
    }

    db.hotels[idx] = {
      ...db.hotels[idx],
      ...rest,
      updated_at: new Date().toISOString()
    }

    saveLocalDb(db)
    return NextResponse.json(db.hotels[idx])
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const guard = await requireAdmin(req)
  if (guard.error) return guard.error

  try {
    const { id } = await req.json()
    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })

    const db = getLocalDb()
    db.hotels = (db.hotels ?? []).filter((h: any) => h.id !== id)
    db.banquet_packages = (db.banquet_packages ?? []).filter((bp: any) => bp.hotel_id !== id)
    db.package_items = (db.package_items ?? []).filter((pi: any) => pi.hotel_id !== id)
    db.package_categories = (db.package_categories ?? []).filter((pc: any) => pc.hotel_id !== id)
    db.decoration_packages = (db.decoration_packages ?? []).filter((dp: any) => dp.hotel_id !== id)

    saveLocalDb(db)
    return NextResponse.json({ ok: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
