import { NextRequest, NextResponse } from 'next/server'
import { getLocalDb, saveLocalDb } from '@/lib/supabase/mockDb'

export async function POST(req: NextRequest) {
  try {
    const { phone } = await req.json()
    if (!phone) return NextResponse.json({ error: 'Phone number is required' }, { status: 400 })

    const db = getLocalDb()
    if (!db.profiles) db.profiles = []

    // Check if profile exists by phone number
    let profile = db.profiles.find((p: any) => p.phone === phone)

    if (!profile) {
      profile = {
        id: crypto.randomUUID(),
        email: '',
        full_name: 'Guest User',
        role: 'user',
        phone: phone,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      db.profiles.push(profile)
      saveLocalDb(db)
    }

    return NextResponse.json({ ok: true, profile })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
