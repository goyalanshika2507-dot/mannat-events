const AUTH_CALLBACK_PATH = '/auth/callback'

export function getAuthCallbackUrl(next?: string): string {
  const origin =
    typeof window !== 'undefined'
      ? window.location.origin
      : process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

  const url = new URL(AUTH_CALLBACK_PATH, origin)
  if (next) {
    url.searchParams.set('next', next)
  }
  return url.toString()
}

export type AuthErrorKind = 'email_not_verified' | 'generic'

export function parseAuthError(message: string): {
  kind: AuthErrorKind
  message: string
} {
  const normalized = message.toLowerCase()

  if (
    normalized.includes('email not confirmed') ||
    normalized.includes('email not verified') ||
    normalized.includes('not confirmed')
  ) {
    return {
      kind: 'email_not_verified',
      message:
        'Please verify your email address before signing in. Check your inbox for the confirmation link.',
    }
  }

  if (
    normalized.includes('invalid login credentials') ||
    normalized.includes('invalid email or password')
  ) {
    return {
      kind: 'generic',
      message: 'Invalid email or password. Please try again.',
    }
  }

  if (normalized.includes('already registered') || normalized.includes('already exists')) {
    return {
      kind: 'generic',
      message: 'An account with this email already exists.',
    }
  }

  if (normalized.includes('rate limit') || normalized.includes('too many requests')) {
    return {
      kind: 'generic',
      message: 'Too many attempts. Please wait a moment and try again.',
    }
  }

  return {
    kind: 'generic',
    message: message || 'Something went wrong. Please try again.',
  }
}
