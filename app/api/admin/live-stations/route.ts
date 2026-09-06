import { NextRequest, NextResponse } from 'next/server'
import { mockSupabase } from '@/lib/supabase/mockDb'
import { requireAdmin } from '@/lib/auth/guards'

export async function GET() {
  try {
    const { data } = await mockSupabase.from('live_stations').select()
    const sorted = (data ?? []).sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    return NextResponse.json(sorted)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const guard = await requireAdmin()
  if (guard.error) return guard.error

  try {
    const body = await req.json()
    const { data, error } = await mockSupabase.from('live_stations').insert(body).select()
    if (error) return NextResponse.json({ error }, { status: 500 })
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  const guard = await requireAdmin()
  if (guard.error) return guard.error

  try {
    const { id, ...rest } = await req.json()
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
    const { data, error } = await mockSupabase.from('live_stations').update(rest).eq('id', id).select()
    if (error) return NextResponse.json({ error }, { status: 500 })
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const guard = await requireAdmin()
  if (guard.error) return guard.error

  try {
    const { id } = await req.json()
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
    const { data, error } = await mockSupabase.from('live_stations').delete().eq('id', id)
    if (error) return NextResponse.json({ error }, { status: 500 })
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
