import { NextRequest, NextResponse } from 'next/server'
import { getLocalDb, saveLocalDb } from '@/lib/supabase/mockDb'

export async function POST(req: NextRequest) {
  try {
    const { phone } = await req.json()
    if (!phone) return NextResponse.json({ error: 'Phone number is required' }, { status: 400 })

    const db = getLocalDb()
    if (!db.profiles) db.profiles = []

    // Check if profile exists
    let profile = db.profiles.find((p: any) => p.phone === phone)

    // Treat +919876543210 as admin specifically
    const isAdminPhone = phone === '+919876543210'

    if (!profile) {
      profile = {
        id: isAdminPhone ? 'admin-user-id' : crypto.randomUUID(),
        email: isAdminPhone ? 'admin@mannatevents.com' : '',
        full_name: isAdminPhone ? 'Mannat Admin' : 'Guest User',
        role: isAdminPhone ? 'admin' : 'user',
        phone: phone,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      db.profiles.push(profile)
      saveLocalDb(db)
    } else if (isAdminPhone && profile.role !== 'admin') {
      // Ensure admin phone is always admin role
      profile.role = 'admin'
      profile.email = 'admin@mannatevents.com'
      profile.full_name = 'Mannat Admin'
      saveLocalDb(db)
    }

    return NextResponse.json({ ok: true, profile })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
