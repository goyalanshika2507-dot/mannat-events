import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { generateBookingId, calculateDuration } from '@/lib/utils/booking'

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

    // 1. Resolve User & Profile via service client
    const serviceClient = createServiceClient()
    let userId: string | null = null
    let customerEmail: string | null = body.email ?? null
    let phone: string = body.phone || '+919999999999'

    try {
      const supabase = await createClient()
      const { data: authData } = await supabase.auth.getUser()
      if (authData?.user) {
        // Verify user exists in profiles table before assigning user_id
        const { data: userProfile } = await serviceClient
          .from('profiles')
          .select('id, email')
          .eq('id', authData.user.id)
          .single()

        if (userProfile) {
          userId = userProfile.id
          customerEmail = userProfile.email ?? customerEmail
        }
      }
    } catch {
      /* ignore auth check failure for guest bookings */
    }

    // 2. Insert Booking Row into Persistent Database
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

    let { data: booking, error: insertError } = await serviceClient
      .from('bookings')
      .insert(newBookingRecord)
      .select('booking_id')
      .single()

    if (insertError) {
      console.error('[POST /api/bookings] Supabase insert error:', insertError)

      // Fallback mechanism: if missing column / PGRST204 error occurs prior to SQL migration execution, retry using base schema columns
      if (insertError.code === 'PGRST204' || insertError.message?.includes('schema cache') || insertError.message?.includes('column')) {
        console.warn('[POST /api/bookings] Retrying insert using base schema fields...')
        const fallbackRecord = {
          booking_id: newBookingRecord.booking_id,
          user_id: newBookingRecord.user_id,
          customer_email: newBookingRecord.customer_email,
          check_in: newBookingRecord.check_in,
          check_out: newBookingRecord.check_out,
          duration: newBookingRecord.duration,
          phone: newBookingRecord.phone,
          day_plans: newBookingRecord.day_plans,
          functions: newBookingRecord.functions,
          is_flagged: newBookingRecord.is_flagged,
          status: newBookingRecord.status,
          notes: `[Decor: ${newBookingRecord.decoration_package}, Theme: ${newBookingRecord.decoration_theme_title}, Total: ₹${calcResult.grandTotal.toLocaleString('en-IN')}] ${hotelNotes}`,
          created_at: newBookingRecord.created_at,
          updated_at: newBookingRecord.updated_at
        }
        const fallbackRes = await serviceClient
          .from('bookings')
          .insert(fallbackRecord)
          .select('booking_id')
          .single()

        if (!fallbackRes.error && fallbackRes.data) {
          booking = fallbackRes.data
          insertError = null
        } else if (fallbackRes.error) {
          console.error('[POST /api/bookings] Fallback insert error:', fallbackRes.error)
        }
      }
    }

    if (insertError) {
      return NextResponse.json({ error: insertError.message || 'Failed to save booking to database.' }, { status: 500 })
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