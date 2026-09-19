import 'server-only'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { mockSupabase } from './mockDb'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

export async function createClient() {
  if (supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('placeholder')) {
    return createSupabaseClient(supabaseUrl, supabaseAnonKey)
  }
  return mockSupabase as any
}

export function createServiceClient() {
  if (supabaseUrl && (supabaseServiceKey || supabaseAnonKey) && !supabaseUrl.includes('placeholder')) {
    const key = supabaseServiceKey || supabaseAnonKey!
    return createSupabaseClient(supabaseUrl, key)
  }
  return mockSupabase as any
}