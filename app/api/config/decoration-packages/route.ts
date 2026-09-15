import { NextRequest, NextResponse } from 'next/server'
import { getLocalDb } from '@/lib/supabase/mockDb'

export async function GET(req: NextRequest) {
  try {
    const hotelId = req.nextUrl.searchParams.get('hotel_id') || 'mannat-events'
    const db = getLocalDb()
    const packages = db.decoration_packages ?? []

    if (hotelId === 'all') {
      const active = packages.filter((d: any) => d.is_active !== false)
      return NextResponse.json(active)
    }

    const filtered = packages
      .filter((d: any) => d.is_active !== false && (d.hotel_id === hotelId || (!d.hotel_id && hotelId === 'mannat-events')))
      .sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0))

    return NextResponse.json(filtered)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
