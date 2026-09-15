import { NextRequest, NextResponse } from 'next/server'
import { getLocalDb, saveLocalDb, mockSupabase } from '@/lib/supabase/mockDb'
import { requireAdmin } from '@/lib/auth/guards'

/** GET /api/admin/hotels/[hotelId]/menu — package config for a specific hotel */
export async function GET(_req: NextRequest, { params }: { params: Promise<{ hotelId: string }> }) {
  try {
    const { hotelId } = await params
    const db = getLocalDb()

    const pkgCats = (db.package_categories ?? []).filter((pc: any) => pc.hotel_id === hotelId)
    const pkgItems = (db.package_items ?? []).filter((pi: any) => pi.hotel_id === hotelId)
    const packages = (db.banquet_packages ?? [])
      .filter((p: any) => p.hotel_id === hotelId)
      .sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0))

    const { data: categories } = await mockSupabase.from('menu_categories').select()
    const { data: allItems } = await mockSupabase.from('menu_items').select()

    return NextResponse.json({ pkgCats, pkgItems, packages, categories: categories ?? [], allItems: allItems ?? [] })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

/** PATCH /api/admin/hotels/[hotelId]/menu — update category limit OR dish price */
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ hotelId: string }> }) {
  const guard = await requireAdmin(req)
  if (guard.error) return guard.error

  try {
    const { hotelId } = await params
    const body = await req.json()
    const { package_id, category_id, limit_count, item_id, price } = body
    if (!package_id) return NextResponse.json({ error: 'package_id required' }, { status: 400 })

    const db = getLocalDb()

    // Update dish price in package_items
    if (item_id !== undefined && price !== undefined) {
      const idx = (db.package_items ?? []).findIndex(
        (r: any) => r.package_id === package_id && r.item_id === item_id && r.hotel_id === hotelId
      )
      if (idx !== -1) {
        db.package_items[idx].price = Number(price)
      } else {
        db.package_items = db.package_items ?? []
        db.package_items.push({ hotel_id: hotelId, package_id, category_id: category_id || 'main', item_id, price: Number(price) })
      }
      saveLocalDb(db)
      return NextResponse.json({ ok: true })
    }

    // Update category limit
    if (category_id && limit_count !== undefined) {
      db.package_categories = db.package_categories ?? []
      const idx = db.package_categories.findIndex(
        (r: any) => r.package_id === package_id && r.category_id === category_id && r.hotel_id === hotelId
      )
      if (idx !== -1) {
        db.package_categories[idx].limit_count = Number(limit_count)
      } else {
        db.package_categories.push({ hotel_id: hotelId, package_id, category_id, limit_count: Number(limit_count) })
      }
      saveLocalDb(db)
      return NextResponse.json({ ok: true })
    }

    return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

/** POST /api/admin/hotels/[hotelId]/menu — add dish to hotel package */
export async function POST(req: NextRequest, { params }: { params: Promise<{ hotelId: string }> }) {
  const guard = await requireAdmin(req)
  if (guard.error) return guard.error

  try {
    const { hotelId } = await params
    const { package_id, category_id, item_id, price } = await req.json()
    if (!package_id || !category_id || !item_id) {
      return NextResponse.json({ error: 'package_id, category_id, item_id required' }, { status: 400 })
    }

    const db = getLocalDb()
    db.package_items = db.package_items ?? []

    const existingIdx = db.package_items.findIndex(
      (r: any) => r.package_id === package_id && r.item_id === item_id && r.hotel_id === hotelId
    )

    const record = { hotel_id: hotelId, package_id, category_id, item_id, price: Number(price ?? 0) }

    if (existingIdx !== -1) {
      db.package_items[existingIdx] = record
    } else {
      db.package_items.push(record)
    }

    saveLocalDb(db)
    return NextResponse.json(record, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

/** DELETE /api/admin/hotels/[hotelId]/menu — remove dish from hotel package */
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ hotelId: string }> }) {
  const guard = await requireAdmin(req)
  if (guard.error) return guard.error

  try {
    const { hotelId } = await params
    const { package_id, category_id, item_id } = await req.json()
    if (!package_id || !category_id || !item_id) {
      return NextResponse.json({ error: 'package_id, category_id, item_id required' }, { status: 400 })
    }

    const db = getLocalDb()
    db.package_items = (db.package_items ?? []).filter(
      (r: any) => !(r.package_id === package_id && r.category_id === category_id && r.item_id === item_id && r.hotel_id === hotelId)
    )
    saveLocalDb(db)
    return NextResponse.json({ ok: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
