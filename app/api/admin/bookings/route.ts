import { NextRequest, NextResponse } from 'next/server'
import { mockSupabase } from '@/lib/supabase/mockDb'
import { requireAdmin } from '@/lib/auth/guards'

export async function GET(req: NextRequest) {
  const guard = await requireAdmin()
  if (guard.error) return guard.error

  try {
    const { data: bookings, error } = await mockSupabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(bookings ?? [])
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  const guard = await requireAdmin()
  if (guard.error) return guard.error

  try {
    const body = await req.json()
    const { booking_id, id, status, notes } = body
    const targetId = booking_id || id

    if (!targetId) {
      return NextResponse.json({ error: 'booking_id is required' }, { status: 400 })
    }

    const updatePayload: any = { updated_at: new Date().toISOString() }
    if (status) updatePayload.status = status
    if (notes !== undefined) updatePayload.notes = notes

    const { data, error } = await mockSupabase
      .from('bookings')
      .update(updatePayload)
      .eq('booking_id', targetId)
      .select()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
