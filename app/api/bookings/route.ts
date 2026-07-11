import { NextRequest, NextResponse } from 'next/server'
import {
  createClient,
  createServiceClient,
} from '@/lib/supabase/server'
import { BookingSchema } from '@/lib/validators/booking'
import {
  generateBookingId,
  calculateDuration,
} from '@/lib/utils/booking'
import { ZodError } from 'zod'

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate user
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      )
    }

    // 2. Parse and validate request body
    const body = await request.json()
    const parsed = BookingSchema.parse(body)

    // 3. Calculate duration
    const duration = calculateDuration(
      parsed.check_in,
      parsed.check_out
    )

    if (duration <= 0) {
      return NextResponse.json(
        { error: 'Check-out must be after check-in.' },
        { status: 400 }
      )
    }

    // 4. Validate meals
    if (parsed.meals.length !== duration) {
      return NextResponse.json(
        {
          error: `Meal selections must cover all ${duration} days.`,
        },
        { status: 400 }
      )
    }

    // 5. Generate booking ID
    const booking_id = generateBookingId()

    const serviceClient = createServiceClient()

    // 6. Insert complete booking
    const { data: booking, error: insertError } =
      await serviceClient
        .from('bookings')
        .insert({
          booking_id,
          user_id: user.id,
          check_in: parsed.check_in,
          check_out: parsed.check_out,
          duration,
          guests: parsed.guests,
          event_type: parsed.event_type,
          decoration_theme: parsed.decoration_theme,
          theme_colour: parsed.theme_colour,
          room_category: parsed.room_category,
          entertainment: parsed.entertainment,
          photography: parsed.photography,
          transportation: parsed.transportation,
          special_requests: parsed.special_requests,
          meals: parsed.meals,
          status: 'pending',
        })
        .select('booking_id')
        .single()

    if (insertError) {
      console.error('[POST /api/bookings] Insert error:', insertError)
      return NextResponse.json(
        {
          error: 'Failed to create booking. Please try again.',
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        booking_id: booking.booking_id,
      },
      { status: 201 }
    )
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        {
          error: 'Invalid booking data.',
          details: err.flatten(),
        },
        { status: 422 }
      )
    }

    console.error('[POST /api/bookings] Unexpected error:', err)
    return NextResponse.json(
      {
        error: 'An unexpected error occurred.',
      },
      { status: 500 }
    )
  }
}