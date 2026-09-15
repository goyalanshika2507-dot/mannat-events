import { NextRequest, NextResponse } from 'next/server'
import { mockSupabase, getLocalDb, saveLocalDb } from '@/lib/supabase/mockDb'
import { requireAdmin } from '@/lib/auth/guards'

// Mannat Events' own hotel ID — packages for this hotel are the authoritative source
// for the booking wizard's per-head pricing calculation.
const MANNAT_HOTEL_ID = 'mannat-events'

export async function GET(req: NextRequest) {
  try {
    // Default to Mannat Events packages; pass ?hotel_id=xxx to override for other contexts
    const hotelId = req.nextUrl.searchParams.get('hotel_id') ?? MANNAT_HOTEL_ID
    const { data } = await mockSupabase.from('banquet_packages').select()
    let packages = (data ?? []) as any[]

    // Always filter by hotel_id so comparison-hotel packages are never mixed in
    packages = packages.filter((p: any) => (p.hotel_id ?? MANNAT_HOTEL_ID) === hotelId)

    const sorted = packages.sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    return NextResponse.json(sorted)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  const guard = await requireAdmin(req)
  if (guard.error) return guard.error

  try {
    const body = await req.json()
    const { id, hotel_id, ...rest } = body
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

    const fullDb = getLocalDb()
    fullDb.banquet_packages = fullDb.banquet_packages ?? []

    const targetHotelId = hotel_id || 'taj-hotel'
    const idx = fullDb.banquet_packages.findIndex(
      (p: any) => p.id === id && (p.hotel_id ? p.hotel_id === targetHotelId : true)
    )

    if (idx !== -1) {
      fullDb.banquet_packages[idx] = {
        ...fullDb.banquet_packages[idx],
        ...rest,
        updated_at: new Date().toISOString()
      }
      saveLocalDb(fullDb)
      return NextResponse.json(fullDb.banquet_packages[idx])
    }

    // If not found, insert
    const newPkg = { id, hotel_id: targetHotelId, ...rest, updated_at: new Date().toISOString() }
    fullDb.banquet_packages.push(newPkg)
    saveLocalDb(fullDb)
    return NextResponse.json(newPkg)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const guard = await requireAdmin(req)
  if (guard.error) return guard.error

  try {
    const body = await req.json()
    const { data, error } = await mockSupabase.from('banquet_packages').insert(body)
    if (error) return NextResponse.json({ error }, { status: 500 })
    return NextResponse.json(data, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const guard = await requireAdmin(req)
  if (guard.error) return guard.error

  try {
    const { id, hotel_id } = await req.json()
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
    const fullDb = getLocalDb()
    fullDb.banquet_packages = (fullDb.banquet_packages ?? []).filter(
      (p: any) => !(p.id === id && (hotel_id ? p.hotel_id === hotel_id : true))
    )
    saveLocalDb(fullDb)
    return NextResponse.json({ ok: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
