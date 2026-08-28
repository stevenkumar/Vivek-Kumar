import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AdminSidebar from './AdminSidebar'
import AdminHeader from './AdminHeader'

export const AdminLayout = ({
  activeTab,
  onSelectTab,
  unreadCount = 0,
  onExit,
  onLogout,
  onRefreshAll,
  isRefreshing = false,
  children,
}) => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)

  return (
    <div className="h-screen max-h-screen w-screen max-w-[100vw] overflow-hidden flex bg-theme-canvas text-theme-base font-sans select-text">
      {/* Fixed Left Sidebar (Desktop) */}
      <div className="hidden lg:flex h-full max-h-screen shrink-0 sticky top-0 z-30">
        <AdminSidebar
          activeTab={activeTab}
          onSelectTab={onSelectTab}
          unreadCount={unreadCount}
          onExit={onExit}
          onLogout={onLogout}
        />
      </div>

      {/* Mobile Sidebar Drawer (Overlay) */}
      <AnimatePresence>
        {mobileDrawerOpen && (
          <div className="fixed inset-0 z-[9999] lg:hidden flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileDrawerOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="relative z-10 h-full max-h-screen"
            >
              <AdminSidebar
                activeTab={activeTab}
                onSelectTab={onSelectTab}
                unreadCount={unreadCount}
                onCloseMobile={() => setMobileDrawerOpen(false)}
                onExit={onExit}
                onLogout={onLogout}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Independently Scrollable Right-Side Main Content Area */}
      <div className="flex-1 h-full max-h-screen overflow-y-auto overflow-x-hidden custom-scrollbar flex flex-col min-w-0">
        <AdminHeader
          activeTab={activeTab}
          onOpenMobile={() => setMobileDrawerOpen(true)}
          onExit={onExit}
          onRefreshAll={onRefreshAll}
          isRefreshing={isRefreshing}
        />

        <main className="p-4 sm:p-6 md:p-8 lg:p-10 max-w-7xl w-full mx-auto flex-1">
          {children}
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
