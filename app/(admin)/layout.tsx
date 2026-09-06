import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AdminSidebarNav } from '@/components/admin/AdminSidebarNav'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login?redirectTo=/admin')

  // Get profile to verify admin role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name, email, phone')
    .eq('id', user.id)
    .single()

  // TEMPORARY OVERRIDE FOR TESTING PHASE:
  // Any authenticated user can access /admin during testing phase.
  // Set DEV_ALLOW_ANY_PHONE = false when real admin phone numbers are provided.
  const DEV_ALLOW_ANY_PHONE = true

  if (!DEV_ALLOW_ANY_PHONE) {
    if (!profile || profile.role !== 'admin') {
      redirect('/dashboard')
    }
  }

  const displayProfile = profile || {
    id: user.id,
    full_name: user.user_metadata?.full_name || 'Admin Tester',
    phone: user.phone || 'Authenticated User',
    role: 'admin',
  }

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-[#E8E2D8] flex flex-col lg:flex-row relative overflow-x-hidden">
      {/* Textured noise overlay */}
      <div className="fixed inset-0 luxury-noise pointer-events-none z-0 opacity-40 select-none" />

      {/* Ambient background glows */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] rounded-full bg-[#C5A85C]/5 blur-[120px] pointer-events-none select-none z-0" />
      <div className="fixed bottom-0 left-64 w-[400px] h-[400px] rounded-full bg-[#9A7B2E]/5 blur-[100px] pointer-events-none select-none z-0" />

      {/* Responsive Luxury Sidebar Navigation */}
      <AdminSidebarNav profile={displayProfile} />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen relative z-10">
        {/* Header Bar */}
        <header className="hidden lg:flex sticky top-0 z-20 bg-[#0D0D0F]/90 backdrop-blur-md border-b border-[#C5A85C]/20 px-8 py-3.5 items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-[0.2em] bg-[#C5A85C]/15 border border-[#C5A85C]/30 text-[#C5A85C]">
              Mannat CMS
            </span>
            <h2 className="text-xs font-serif tracking-widest text-[#A1A1AA] uppercase">
              Management Portal
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs font-mono text-[#A1A1AA] bg-[#18181C] px-3 py-1 rounded-full border border-[#27272A]">
              Logged in as: <strong className="text-[#C5A85C]">{displayProfile.full_name || displayProfile.phone}</strong>
            </span>
          </div>
        </header>

        {/* Page Content Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  )
}