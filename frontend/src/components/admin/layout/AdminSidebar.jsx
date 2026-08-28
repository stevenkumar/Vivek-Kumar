import React from 'react'
import {
  LayoutDashboard,
  Palette,
  User,
  Share2,
  FolderKanban,
  Mail,
  ShieldCheck,
  Globe,
  LogOut,
  X,
} from 'lucide-react'
import { useSettings } from '../../../context/SettingsContext'

export const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'profile', label: 'Website Settings', icon: User, badge: 'Bio' },
  { id: 'theme', label: 'Theme & Colors', icon: Palette, badge: 'Live' },
  { id: 'projects', label: 'Projects', icon: FolderKanban },
  { id: 'messages', label: 'Messages', icon: Mail, badgeKey: 'unreadMessages' },
  { id: 'socials', label: 'Social Channels', icon: Share2 },
  { id: 'account', label: 'Admin Security', icon: ShieldCheck },
]

export const AdminSidebar = ({ activeTab, onSelectTab, unreadCount = 0, onCloseMobile, onExit, onLogout }) => {
  const { profile } = useSettings()

  return (
    <aside className="w-64 sm:w-72 bg-theme-card border-r border-theme h-full max-h-screen flex flex-col justify-between p-5 sm:p-6 select-none shrink-0 overflow-y-auto custom-scrollbar">
      {/* Brand Header */}
      <div>
        <div className="flex items-center justify-between pb-5 mb-5 border-b border-theme">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-theme-canvas border border-theme flex items-center justify-center text-theme-primary font-black text-lg shadow-md">
              VK
            </div>
            <div>
              <h2 className="font-black text-theme-base text-base leading-tight">Admin Console</h2>
              <p className="text-[11px] font-mono text-theme-muted">{profile?.name || 'Vivek Kumar'}</p>
            </div>
          </div>

          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-2 text-theme-muted hover:text-white rounded-xl hover:bg-theme-canvas transition cursor-pointer"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Navigation List */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = activeTab === item.id
            const badge = item.badgeKey === 'unreadMessages' && unreadCount > 0 ? `${unreadCount} new` : item.badge

            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id)
                  if (onCloseMobile) onCloseMobile()
                }}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer group ${
                  active
                    ? 'gradient-primary text-white shadow-lg'
                    : 'text-theme-muted hover:text-theme-base hover:bg-theme-canvas'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon size={18} className={`shrink-0 ${active ? 'text-white' : 'text-theme-muted group-hover:text-theme-primary transition-colors'}`} />
                  <span className="truncate">{item.label}</span>
                </div>

                {badge && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold shrink-0 ml-2 ${
                      active
                        ? 'bg-white/20 text-white'
                        : item.badgeKey === 'unreadMessages' && unreadCount > 0
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse'
                        : 'bg-theme-canvas text-theme-muted border border-theme'
                    }`}
                  >
                    {badge}
                  </span>
                )}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Footer Quick Actions */}
      <div className="pt-5 mt-6 border-t border-theme space-y-2">
        <button
          onClick={onExit}
          className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-theme-canvas hover:bg-zinc-800 text-xs font-bold text-theme-muted hover:text-theme-base transition-colors cursor-pointer border border-theme"
        >
          <Globe size={15} className="text-theme-primary shrink-0" />
          <span className="truncate">View Public Website</span>
        </button>

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-red-950/30 hover:bg-red-900/50 text-xs font-bold text-red-300 border border-red-500/20 transition-colors cursor-pointer"
        >
          <LogOut size={15} className="shrink-0" />
          <span className="truncate">Exit / Lock Panel</span>
        </button>
      </div>
    </aside>
  )
}

export default AdminSidebar
