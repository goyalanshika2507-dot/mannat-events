import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { generateBookingId, calculateDuration } from '@/lib/utils/booking'
import { getLocalDb, saveLocalDb } from '@/lib/supabase/mockDb'

import { calculateBookingEstimate } from '@/lib/utils/pricingCalculator'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    if (!body.check_in || !body.check_out) {
      return NextResponse.json({ error: 'Check-in and Check-out dates are required.' }, { status: 400 })
    }

    const duration = calculateDuration(body.check_in, body.check_out)
    if (duration <= 0) {
      return NextResponse.json({ error: 'Check-out must be after check-in.' }, { status: 400 })
    }

    // Backend-authoritative price calculation — always use Mannat Events pricing.
    // Comparison hotels are reference-only; they must never affect the booking total.
    const mannatPricingInput = {
      ...body,
      selected_hotel: { id: 'mannat-events', name: 'Mannat Events' },
    }
    const calcResult = calculateBookingEstimate(mannatPricingInput)
    if (!calcResult.valid) {
      return NextResponse.json({ error: calcResult.error || 'Invalid booking selection' }, { status: 400 })
    }

    const booking_id = generateBookingId()

    // Per-head rate resolved from Mannat Events packages
    const perHeadRate = calcResult.breakdown.details[0]?.lunchRate ?? calcResult.breakdown.details[0]?.dinnerRate ?? 2000
    const verifiedSelectedHotel = {
      id: 'mannat-events',
      name: 'Mannat Events',
      package_price: perHeadRate,
      price_display: `₹${perHeadRate.toLocaleString('en-IN')}/head`,
    }

    const hotelNotes = `Decor Tier: ${body.decoration_package ?? 'Not Selected'}, Mannat Events Total: ${calcResult.priceDisplay}`

    // 1. Resolve User & Profile
    let userId: string | null = null
    let customerEmail: string | null = body.email ?? null
    let phone: string = body.phone || '+919999999999'

    try {
      const supabase = await createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        userId = user.id
        customerEmail = user.email ?? customerEmail
        if (user.phone) phone = user.phone
      }
    } catch {
      /* ignore auth check failure for guest bookings */
    }

    // Ensure user profile exists for phone and get user_id
    if (phone) {
      const db = getLocalDb()
      if (!db.profiles) db.profiles = []
      let profile = db.profiles.find((p: any) => p.phone === phone)

      if (!profile) {
        profile = {
          id: crypto.randomUUID(),
          email: `${phone.replace(/\D/g, '')}@mannatevents.com`,
          full_name: 'Guest User',
          role: 'user',
          phone,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
        db.profiles.push(profile)
        saveLocalDb(db)
      }

      if (!userId) {
        userId = profile.id
      }
      if (!customerEmail) {
        customerEmail = profile.email
      }
    }

    // 2. Insert Booking Row with status='pending'
    const serviceClient = createServiceClient()
    const newBookingRecord = {
      booking_id,
      user_id: userId,
      customer_email: customerEmail || `${phone.replace(/\D/g, '')}@mannatevents.com`,
      check_in: body.check_in,
      check_out: body.check_out,
      duration,
      phone,
      day_plans: body.day_plans ?? [],
      functions: body.functions ?? [],
      selected_hotel: verifiedSelectedHotel,
      decoration_package: body.decoration_package ?? 'Gold',
      decoration_theme_title: body.decoration_theme_title ?? 'Taj View Terraces',
      total_price: calcResult.grandTotal,
      is_flagged: false,
      status: 'pending',
      notes: hotelNotes,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    const { data: booking, error: insertError } = await serviceClient
      .from('bookings')
      .insert(newBookingRecord)
      .select('booking_id')
      .single()

    if (insertError) {
      console.error('[POST /api/bookings] Insert error:', insertError)
      return NextResponse.json({ error: 'Failed to save booking. Please try again.' }, { status: 500 })
    }

    const response = NextResponse.json({ booking_id }, { status: 201 })

    // Set session cookie so user is authenticated
    if (phone) {
      response.cookies.set('mannat-session', phone, {
        path: '/',
        maxAge: 86400,
        httpOnly: false,
        sameSite: 'lax',
      })
    }

    return response

  } catch (err: any) {
    console.error('[POST /api/bookings] Unexpected error:', err)
    return NextResponse.json({ error: 'An unexpected error occurred. Please try again.' }, { status: 500 })
  }
}