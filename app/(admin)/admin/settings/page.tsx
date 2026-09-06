'use client'

import { useState } from 'react'
import { Settings, ShieldCheck, Check, Database, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { toast } from 'sonner'

export default function AdminSettingsPage() {
  const [migrating, setMigrating] = useState(false)

  async function handleReseed() {
    if (!confirm('Re-run database seed migration? This will sync latest package definitions.')) return
    setMigrating(true)
    try {
      const res = await fetch('/api/migrate', { method: 'POST' })
      const data = await res.json()
      if (res.ok) {
        toast.success(data.message || 'Database successfully re-seeded!')
      } else {
        toast.error(data.error || 'Migration failed')
      }
    } catch (err) {
      toast.error('Migration error')
    } finally {
      setMigrating(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-caption text-[#C9A84C] mb-1">System</p>
        <h1 className="text-headline">Admin Settings</h1>
        <p className="mt-1 text-sm text-[#737373]">
          Portal settings, database synchronization, and system configuration.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-[#E8E2D8] bg-white p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F5EDD6] border border-[#E8D9A8] flex items-center justify-center text-[#A08040]">
              <Database size={20} />
            </div>
            <div>
              <h2 className="font-semibold text-[#1A1A1A]">Database Sync &amp; Migration</h2>
              <p className="text-xs text-[#737373]">Re-sync local database storage with default seed configuration.</p>
            </div>
          </div>
          <p className="text-xs text-[#737373] leading-relaxed">
            Run the automated migration engine to ensure all 209 menu items, categories, banquet packages, live stations, add-ons, and decoration tiers are updated.
          </p>
          <Button onClick={handleReseed} loading={migrating} variant="secondary" size="md">
            <RefreshCw size={14} className="mr-1.5" /> Re-seed Database
          </Button>
        </div>

        <div className="rounded-2xl border border-[#E8E2D8] bg-white p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F5EDD6] border border-[#E8D9A8] flex items-center justify-center text-[#A08040]">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h2 className="font-semibold text-[#1A1A1A]">Role Authorization</h2>
              <p className="text-xs text-[#737373]">System role security rules.</p>
            </div>
          </div>
          <div className="space-y-2 text-xs text-[#737373]">
            <p><strong>Role Requirement:</strong> <span className="font-mono text-[#1A1A1A]">profiles.role = &apos;admin&apos;</span></p>
            <p><strong>Authentication:</strong> Phone + OTP (<code className="bg-[#F5EDD6] px-1 py-0.5 rounded text-[#A08040]">0000</code> test mode)</p>
            <p><strong>Role Enforcement:</strong> Middleware &amp; API level guards active</p>
          </div>
        </div>
      </div>
    </div>
  )
}
