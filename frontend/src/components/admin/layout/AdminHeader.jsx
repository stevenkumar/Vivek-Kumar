import React from 'react'
import { Menu, Eye, ShieldCheck, RefreshCw, Sparkles } from 'lucide-react'
import { navItems } from './AdminSidebar'
import { useSettings } from '../../../context/SettingsContext'

export const AdminHeader = ({ activeTab, onOpenMobile, onExit, onRefreshAll, isRefreshing = false }) => {
  const { profile, theme } = useSettings()
  const currentNav = navItems.find((n) => n.id === activeTab) || navItems[0]

  return (
    <header className="sticky top-0 z-40 bg-theme-canvas/90 backdrop-blur-xl border-b border-theme px-6 py-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobile}
          className="lg:hidden p-2 rounded-xl bg-theme-card border border-theme text-theme-muted hover:text-white transition cursor-pointer"
          aria-label="Open Navigation Drawer"
        >
          <Menu size={18} />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-theme-muted uppercase tracking-wider hidden sm:inline">Admin /</span>
            <h1 className="font-black text-theme-base text-lg sm:text-xl tracking-tight">{currentNav.label}</h1>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Active Theme Chip */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-theme-card border border-theme text-xs font-mono">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: theme?.primaryColor || '#06b6d4' }} />
          <span className="text-theme-muted">Theme:</span>
          <span className="text-theme-primary font-bold">{theme?.primaryColor || '#06b6d4'}</span>
        </div>

        {/* Live Server Indicator */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>System Healthy (No DB)</span>
        </div>

        {/* Sync / Refresh Button */}
        {onRefreshAll && (
          <button
            onClick={onRefreshAll}
            disabled={isRefreshing}
            className="p-2 rounded-xl bg-theme-card hover:bg-zinc-800 text-theme-muted hover:text-white transition border border-theme cursor-pointer"
            title="Reload Data from Server"
          >
            <RefreshCw size={16} className={isRefreshing ? 'animate-spin text-theme-primary' : ''} />
          </button>
        )}

        {/* View Site */}
        <button
          onClick={onExit}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl gradient-primary text-white text-xs font-bold transition shadow-lg cursor-pointer hover:opacity-95"
        >
          <Eye size={14} />
          <span className="hidden sm:inline">View Public Website</span>
        </button>
      </div>
    </header>
  )
}

export default AdminHeader
