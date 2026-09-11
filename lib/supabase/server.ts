import 'server-only'

import { mockSupabase } from './mockDb'

export async function createClient(...args: any[]) {
  return mockSupabase
}

export function createServiceClient(...args: any[]) {
  return mockSupabase
}