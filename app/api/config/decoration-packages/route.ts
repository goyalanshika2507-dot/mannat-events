import { NextResponse } from 'next/server'
import { mockSupabase } from '@/lib/supabase/mockDb'

export async function GET() {
  try {
    const { data } = await mockSupabase.from('decoration_packages').select()
    const active = (data ?? [])
      .filter((d: any) => d.is_active)
      .sort((a: any, b: any) => a.sort_order - b.sort_order)
    return NextResponse.json(active)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
