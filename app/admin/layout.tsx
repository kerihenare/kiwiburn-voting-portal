import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Header } from '@/components/header'
import { AdminSidebar } from './admin-sidebar'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/sign-in')
  }

  // Simple admin check - can be made more sophisticated with a database table
  const isAdmin = user?.email?.endsWith('@kiwiburn.com') || false
  
  if (!isAdmin) {
    redirect('/')
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header user={user} isAdmin={isAdmin} />
      <div className="flex-1 flex">
        <AdminSidebar />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
