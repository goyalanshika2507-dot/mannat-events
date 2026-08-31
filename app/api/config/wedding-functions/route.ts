import { NextResponse } from 'next/server'
import { mockSupabase } from '@/lib/supabase/mockDb'

export async function GET() {
  try {
    const { data } = await mockSupabase.from('wedding_functions').select()
    const active = (data ?? [])
      .filter((f: any) => f.is_active)
      .sort((a: any, b: any) => a.sort_order - b.sort_order)
    return NextResponse.json(active)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
