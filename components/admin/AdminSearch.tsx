'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

export function AdminSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentSearch = searchParams.get('search') || ''
  const currentStatus = searchParams.get('status') || ''

  const [query, setQuery] = useState(currentSearch)

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (currentStatus) params.set('status', currentStatus)
    if (query.trim()) params.set('search', query.trim())
    
    router.push(`/admin?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSearch} className="flex items-center gap-2 max-w-sm w-full">
      <Input
        placeholder="Search by ID, Name or Email..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <Button type="submit" variant="secondary">Search</Button>
    </form>
  )
}
