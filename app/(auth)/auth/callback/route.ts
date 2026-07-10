import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

type AuthFlow = 'email_verification' | 'password_recovery' | 'oauth'

function resolveRedirectPath(next: string | null, flow: AuthFlow): string {
  if (next?.startsWith('/')) {
    return next
  }

  switch (flow) {
    case 'password_recovery':
      return '/reset-password'
    case 'email_verification':
      return '/login?verified=1'
    case 'oauth':
      return '/dashboard'
    default:
      return '/dashboard'
  }
}

function detectAuthFlow(
  next: string | null,
  type: string | null
): AuthFlow {
  if (type === 'recovery' || next === '/reset-password') {
    return 'password_recovery'
  }

  if (next === '/login' || next?.startsWith('/login?')) {
    return 'email_verification'
  }

  // OAuth providers can set a dedicated next param or flow flag here later.
  return 'email_verification'
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next')
  const type = requestUrl.searchParams.get('type')
  const origin = requestUrl.origin

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=auth_callback_error`)
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    return NextResponse.redirect(`${origin}/login?error=auth_callback_error`)
  }

  const flow = detectAuthFlow(next, type)
  const redirectPath = resolveRedirectPath(next, flow)

  return NextResponse.redirect(`${origin}${redirectPath}`)
}
