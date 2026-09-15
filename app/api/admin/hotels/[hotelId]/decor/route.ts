import { NextRequest, NextResponse } from 'next/server'
import { getLocalDb, saveLocalDb } from '@/lib/supabase/mockDb'
import { requireAdmin } from '@/lib/auth/guards'

/** GET /api/admin/hotels/[hotelId]/decor — decoration packages for a specific hotel */
export async function GET(_req: NextRequest, { params }: { params: Promise<{ hotelId: string }> }) {
  try {
    const { hotelId } = await params
    const db = getLocalDb()
    const decor = (db.decoration_packages ?? [])
      .filter((d: any) => d.hotel_id === hotelId)
      .sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    return NextResponse.json(decor)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

/** PATCH /api/admin/hotels/[hotelId]/decor — update a decoration package for a specific hotel */
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ hotelId: string }> }) {
  const guard = await requireAdmin(req)
  if (guard.error) return guard.error

  try {
    const { hotelId } = await params
    const body = await req.json()
    const { id, ...rest } = body
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

    const db = getLocalDb()
    const idx = (db.decoration_packages ?? []).findIndex(
      (d: any) => d.id === id && d.hotel_id === hotelId
    )

    if (idx === -1) {
      return NextResponse.json({ error: 'Decoration package not found for this hotel' }, { status: 404 })
    }

    db.decoration_packages[idx] = {
      ...db.decoration_packages[idx],
      ...rest,
      updated_at: new Date().toISOString()
    }
    saveLocalDb(db)
    return NextResponse.json(db.decoration_packages[idx])
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

/** POST /api/admin/hotels/[hotelId]/decor — create a new decoration package for a hotel */
export async function POST(req: NextRequest, { params }: { params: Promise<{ hotelId: string }> }) {
  const guard = await requireAdmin(req)
  if (guard.error) return guard.error

  try {
    const { hotelId } = await params
    const body = await req.json()
    if (!body.id || !body.title) return NextResponse.json({ error: 'id and title required' }, { status: 400 })

    const db = getLocalDb()
    db.decoration_packages = db.decoration_packages ?? []

    const exists = db.decoration_packages.some((d: any) => d.id === body.id && d.hotel_id === hotelId)
    if (exists) return NextResponse.json({ error: 'Decoration package already exists for this hotel' }, { status: 400 })

    const newDecor = { ...body, hotel_id: hotelId, is_active: body.is_active ?? true }
    db.decoration_packages.push(newDecor)
    saveLocalDb(db)
    return NextResponse.json(newDecor, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

/** DELETE /api/admin/hotels/[hotelId]/decor — remove a decoration package from a hotel */
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ hotelId: string }> }) {
  const guard = await requireAdmin(req)
  if (guard.error) return guard.error

  try {
    const { hotelId } = await params
    const { id } = await req.json()
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

    const db = getLocalDb()
    db.decoration_packages = (db.decoration_packages ?? []).filter(
      (d: any) => !(d.id === id && d.hotel_id === hotelId)
    )
    saveLocalDb(db)
    return NextResponse.json({ ok: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
