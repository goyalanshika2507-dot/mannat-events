import { NextRequest, NextResponse } from 'next/server'
import { getLocalDb, saveLocalDb } from '@/lib/supabase/mockDb'
import { requireAdmin } from '@/lib/auth/guards'

/** GET /api/admin/hotels/[hotelId]/packages — all packages for a specific hotel */
export async function GET(_req: NextRequest, { params }: { params: Promise<{ hotelId: string }> }) {
  try {
    const { hotelId } = await params
    const db = getLocalDb()
    const pkgs = (db.banquet_packages ?? [])
      .filter((p: any) => p.hotel_id === hotelId)
      .sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    return NextResponse.json(pkgs)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

/** PATCH /api/admin/hotels/[hotelId]/packages — update a package's price/active/name for a specific hotel */
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ hotelId: string }> }) {
  const guard = await requireAdmin(req)
  if (guard.error) return guard.error

  try {
    const { hotelId } = await params
    const body = await req.json()
    const { id, ...rest } = body
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

    const db = getLocalDb()
    const idx = (db.banquet_packages ?? []).findIndex(
      (p: any) => p.id === id && p.hotel_id === hotelId
    )

    if (idx === -1) {
      return NextResponse.json({ error: 'Package not found for this hotel' }, { status: 404 })
    }

    db.banquet_packages[idx] = {
      ...db.banquet_packages[idx],
      ...rest,
      updated_at: new Date().toISOString()
    }
    saveLocalDb(db)
    return NextResponse.json(db.banquet_packages[idx])
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
