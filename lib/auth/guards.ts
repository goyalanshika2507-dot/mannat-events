import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getLocalDb } from '@/lib/supabase/mockDb'

/**
 * Resolves the current user's profile from the mannat-session cookie.
 * Returns { profile, user } on success, or { error, status } on failure.
 */
export async function resolveUser(req?: NextRequest) {
  let session: string | null = null

  // Try reading from request headers cookie (middleware context)
  if (req) {
    session = req.cookies.get('mannat-session')?.value ?? null
  }

  // Fall back to next/headers cookies (route handler context)
  if (!session) {
    try {
      const cookieStore = await cookies()
      session = cookieStore.get('mannat-session')?.value ?? null
    } catch {
      session = null
    }
  }

  if (!session) {
    return { error: 'Not authenticated', status: 401 }
  }

  const db = getLocalDb()
  const profile = (db.profiles || []).find((p: any) => p.phone === session)

  if (!profile) {
    return { error: 'User not found', status: 401 }
  }

  return { profile, user: profile }
}

/**
 * Guard for admin-only route handlers.
 * Returns { profile } on success, or a NextResponse 401/403 on failure.
 */
export async function requireAdmin(req?: NextRequest): Promise<
  | { profile: any; error?: undefined }
  | { error: NextResponse; profile?: undefined }
> {
  const result = await resolveUser(req)

  if ('error' in result && !result.profile) {
    return {
      error: NextResponse.json(
        { error: result.error },
        { status: result.status as number }
      ),
    }
  }

  const profile = result.profile!

  // TEMPORARY OVERRIDE FOR TESTING PHASE:
  // Any authenticated user can access admin APIs during testing phase.
  // Set DEV_ALLOW_ANY_PHONE = false when real admin phone numbers are provided.
  const DEV_ALLOW_ANY_PHONE = true

  if (!DEV_ALLOW_ANY_PHONE) {
    if (profile.role !== 'admin') {
      return {
        error: NextResponse.json(
          { error: 'Forbidden: admin access required' },
          { status: 403 }
        ),
      }
    }
  }

  return { profile }
}
