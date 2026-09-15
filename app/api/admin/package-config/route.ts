import { NextRequest, NextResponse } from 'next/server'
import { mockSupabase } from '@/lib/supabase/mockDb'
import { requireAdmin } from '@/lib/auth/guards'

const MANNAT_HOTEL_ID = 'mannat-events'

export async function GET(req: NextRequest) {
  try {
    // Default to Mannat Events packages; pass ?hotel_id=xxx to get a specific hotel's config
    const hotelId = req.nextUrl.searchParams.get('hotel_id') ?? MANNAT_HOTEL_ID
    const { data: pkgCats } = await mockSupabase.from('package_categories').select()
    const { data: pkgItems } = await mockSupabase.from('package_items').select()

    const filteredCats = (pkgCats ?? []).filter((pc: any) => (pc.hotel_id ?? MANNAT_HOTEL_ID) === hotelId)
    const filteredItems = (pkgItems ?? []).filter((pi: any) => (pi.hotel_id ?? MANNAT_HOTEL_ID) === hotelId)

    return NextResponse.json({ pkgCats: filteredCats, pkgItems: filteredItems })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

/**
 * PATCH /api/admin/package-config
 * Update a package-category limit count OR update a package-item price
 */
export async function PATCH(req: NextRequest) {
  const guard = await requireAdmin(req)
  if (guard.error) return guard.error

  try {
    const body = await req.json()
    const { package_id, category_id, limit_count, item_id, price, hotel_id } = body
    if (!package_id) return NextResponse.json({ error: 'package_id required' }, { status: 400 })
    
    const { getLocalDb, saveLocalDb } = await import('@/lib/supabase/mockDb')
    const fullDb = getLocalDb()

    // Package-item price update
    if (item_id !== undefined && price !== undefined) {
      const idx = (fullDb.package_items ?? []).findIndex(
        (r: any) => r.package_id === package_id && (category_id ? r.category_id === category_id : true) && r.item_id === item_id && (hotel_id ? r.hotel_id === hotel_id : true)
      )
      if (idx !== -1) {
        fullDb.package_items[idx].price = Number(price)
      } else {
        fullDb.package_items.push({ hotel_id: hotel_id || 'taj-hotel', package_id, category_id: category_id || 'main', item_id, price: Number(price) })
      }
      saveLocalDb(fullDb)
      return NextResponse.json({ ok: true, package_items: fullDb.package_items })
    }

    // Package-category limit update
    if (category_id && limit_count !== undefined) {
      const db = fullDb.package_categories ?? []
      const idx = db.findIndex((r: any) => r.package_id === package_id && r.category_id === category_id && (hotel_id ? r.hotel_id === hotel_id : true))
      
      if (idx !== -1) {
        db[idx].limit_count = Number(limit_count)
      } else {
        db.push({ hotel_id: hotel_id || 'taj-hotel', package_id, category_id, limit_count: Number(limit_count) })
      }
      fullDb.package_categories = db
      saveLocalDb(fullDb)
      return NextResponse.json({ ok: true, package_categories: fullDb.package_categories })
    }

    return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

/**
 * POST /api/admin/package-config
 * Add an item to a package category for a hotel
 */
export async function POST(req: NextRequest) {
  const guard = await requireAdmin(req)
  if (guard.error) return guard.error

  try {
    const { package_id, category_id, item_id, price, hotel_id } = await req.json()
    if (!package_id || !category_id || !item_id) {
      return NextResponse.json({ error: 'package_id, category_id, item_id required' }, { status: 400 })
    }
    const itemPrice = price !== undefined ? Number(price) : 0
    const targetHotelId = hotel_id || 'taj-hotel'

    const { getLocalDb, saveLocalDb } = await import('@/lib/supabase/mockDb')
    const fullDb = getLocalDb()
    fullDb.package_items = fullDb.package_items ?? []

    const existingIdx = fullDb.package_items.findIndex(
      (r: any) => r.package_id === package_id && r.item_id === item_id && (r.hotel_id ? r.hotel_id === targetHotelId : true)
    )

    if (existingIdx !== -1) {
      fullDb.package_items[existingIdx] = { hotel_id: targetHotelId, package_id, category_id, item_id, price: itemPrice }
      saveLocalDb(fullDb)
      return NextResponse.json(fullDb.package_items[existingIdx], { status: 200 })
    }

    const newRecord = { hotel_id: targetHotelId, package_id, category_id, item_id, price: itemPrice }
    fullDb.package_items.push(newRecord)
    saveLocalDb(fullDb)
    return NextResponse.json(newRecord, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

/**
 * DELETE /api/admin/package-config
 * Remove an item from a package category for a hotel
 */
export async function DELETE(req: NextRequest) {
  const guard = await requireAdmin(req)
  if (guard.error) return guard.error

  try {
    const { package_id, category_id, item_id, hotel_id } = await req.json()
    if (!package_id || !category_id || !item_id) {
      return NextResponse.json({ error: 'package_id, category_id, item_id required' }, { status: 400 })
    }
    
    const { getLocalDb, saveLocalDb } = await import('@/lib/supabase/mockDb')
    const fullDb = getLocalDb()
    fullDb.package_items = (fullDb.package_items ?? []).filter((r: any) => !(r.package_id === package_id && r.category_id === category_id && r.item_id === item_id && (hotel_id ? (r.hotel_id ? r.hotel_id === hotel_id : true) : true)))
    saveLocalDb(fullDb)
    
    return NextResponse.json({ ok: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
