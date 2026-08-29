import React from 'react'
import {
  FolderKanban,
  Mail,
  Share2,
  Palette,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ExternalLink,
  Plus,
} from 'lucide-react'
import StatWidget from '../ui/StatWidget'
import AdminCard from '../ui/AdminCard'
import { useSettings } from '../../../context/SettingsContext'

export const DashboardSection = ({
  projects = [],
  messages = [],
  onNavigateTab,
  onOpenAddProject,
}) => {
  const { profile, socials, theme } = useSettings()

  const unreadMessages = messages.filter((m) => !m.isRead)
  const recentMessages = messages.slice(0, 3)
  const activeSocialCount = Object.values(socials || {}).filter(Boolean).length

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-theme-card rounded-[22px] border border-theme p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-theme-canvas text-theme-primary border border-theme font-bold">
                Portfolio Control Center
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-theme-base tracking-tight">
              Welcome back, {profile?.name || 'Vivek'}! 👋
            </h2>
            <p className="text-theme-muted text-sm mt-1 max-w-xl">
              Your portfolio is fully active and running on a lightweight, file-based persistence system without database overhead.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onNavigateTab('projects')}
              className="inline-flex items-center gap-2 gradient-primary text-white font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm shadow-lg transition cursor-pointer hover:opacity-95"
            >
              <Plus size={15} />
              <span>Manage Projects</span>
            </button>
            <button
              onClick={() => onNavigateTab('theme')}
              className="inline-flex items-center gap-2 bg-theme-canvas hover:bg-zinc-800 text-theme-base font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm border border-theme transition cursor-pointer"
            >
              <Palette size={15} className="text-theme-primary" />
              <span>Customize Colors</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metric Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatWidget
          title="Total Projects"
          value={projects.length}
          subtitle={`${projects.filter((p) => p.featured).length} Featured on Home`}
          icon={FolderKanban}
          onClick={() => onNavigateTab('projects')}
        />
        <StatWidget
          title="Contact Inquiries"
          value={messages.length}
          subtitle={`${unreadMessages.length} Unread Messages`}
          icon={Mail}
          onClick={() => onNavigateTab('messages')}
        />
        <StatWidget
          title="Active Socials"
          value={activeSocialCount}
          subtitle="Configured Channels"
          icon={Share2}
          onClick={() => onNavigateTab('socials')}
        />
        <StatWidget
          title="Theme Palette"
          value={theme?.primaryColor || '#8999b3'}
          subtitle="Active Root Accent"
          icon={Palette}
          onClick={() => onNavigateTab('theme')}
        />
      </div>

      {/* Two Columns: Recent Inquiries & Quick Config Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Inquiries */}
        <div className="lg:col-span-7">
          <AdminCard
            title="Recent Inquiries"
            subtitle="Latest messages sent through the contact form"
            icon={Mail}
            action={
              <button
                onClick={() => onNavigateTab('messages')}
                className="text-xs font-bold text-theme-primary hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <span>View All ({messages.length})</span>
                <ArrowRight size={13} />
              </button>
            }
          >
            {messages.length === 0 ? (
              <p className="text-center py-8 text-theme-muted text-sm">No inquiries received yet.</p>
            ) : (
              <div className="space-y-3">
                {recentMessages.map((msg) => (
                  <div
                    key={msg.id || msg._id}
                    onClick={() => onNavigateTab('messages')}
                    className="p-4 rounded-xl bg-theme-canvas border border-theme hover:border-theme-primary transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-theme-base group-hover:text-theme-primary transition-colors">
                          {msg.name}
                        </span>
                        {!msg.isRead && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                            NEW
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-theme-muted line-clamp-1 mt-0.5">{msg.message}</p>
                    </div>
                    <div className="text-[11px] font-mono text-theme-muted flex items-center gap-1 shrink-0">
                      <Clock size={11} />
                      <span>{new Date(msg.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </AdminCard>
        </div>

        {/* System & Profile Summary */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <AdminCard title="Website Configuration" subtitle="Live settings snapshot" icon={ShieldCheck}>
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-theme-canvas border border-theme">
                <span className="text-theme-muted">Profile Name</span>
                <span className="font-bold text-theme-base">{profile?.name || 'Vivek Kumar'}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-theme-canvas border border-theme">
                <span className="text-theme-muted">Availability</span>
                <span className={`font-bold ${profile?.openToWork ? 'text-emerald-400' : 'text-zinc-500'}`}>
                  {profile?.openToWork ? '● Open for Work' : '○ Engaged'}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-theme-canvas border border-theme">
                <span className="text-theme-muted">Database Engine</span>
                <span className="font-bold text-theme-primary font-mono">None (File-Based JSON)</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-theme-canvas border border-theme">
                <span className="text-theme-muted">Email Dispatcher</span>
                <span className="font-bold text-theme-base font-mono">Nodemailer SMTP</span>
              </div>
            </div>
          </AdminCard>
        </div>
      </div>
    </div>
  )
}

export default DashboardSection
