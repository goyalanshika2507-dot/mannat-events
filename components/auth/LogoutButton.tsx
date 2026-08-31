'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'

interface Props {
  label?: string
  className?: string
}

export function LogoutButton({ label = 'Sign Out', className }: Props) {
  const router = useRouter()

  async function handleLogout() {
    // Clear the cookie via the API route
    await fetch('/api/auth/logout', { method: 'POST' })
    // Also clear client-side cookie immediately
    document.cookie = 'mannat-session=; path=/; max-age=0; SameSite=Lax'
    router.push('/login')
    router.refresh()
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={handleLogout}
      className={className}
    >
      {label}
    </Button>
  )
}
