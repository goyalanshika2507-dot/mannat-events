'use client'

import { mockSupabase } from './mockDb'

export function createClient(...args: any[]) {
  return mockSupabase
}

export const mockBrowserSupabase = mockSupabase