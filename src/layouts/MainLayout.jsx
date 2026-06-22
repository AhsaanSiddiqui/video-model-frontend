import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { AppHeader } from '../components/layout/AppHeader.jsx'
import { AppSidebar } from '../components/layout/AppSidebar.jsx'

export default function MainLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true)

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-play-canvas text-play-foreground">
      <AppHeader onToggleSidebar={() => setIsSidebarCollapsed((v) => !v)} />
      <div className="flex min-h-0 flex-1 overflow-hidden">
        <AppSidebar collapsed={isSidebarCollapsed} />
        <main className="min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain px-4 py-6 md:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
