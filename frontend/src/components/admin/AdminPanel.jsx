import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Loader2, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react'
import { useSettings } from '../../context/SettingsContext'
import AdminLayout from './layout/AdminLayout'
import DashboardSection from './sections/DashboardSection'
import ProfileSettingsSection from './sections/ProfileSettingsSection'
import SocialsSettingsSection from './sections/SocialsSettingsSection'
import ThemeSettingsSection from './sections/ThemeSettingsSection'
import ProjectsSection from './sections/ProjectsSection'
import MessagesSection from './sections/MessagesSection'
import AccountSettingsSection from './sections/AccountSettingsSection'

const Toast = ({ msg, type, onDone }) => {
  useEffect(() => {
    const t = setTimeout(onDone, 3500)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 30, scale: 0.95 }}
      className={`fixed bottom-6 right-6 z-[999999] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl font-medium text-sm border backdrop-blur-xl ${
        type === 'success'
          ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200'
          : type === 'info'
          ? 'bg-cyan-950/90 border-cyan-500/40 text-cyan-200'
          : 'bg-red-950/90 border-red-500/40 text-red-200'
      }`}
    >
      {type === 'success' ? (
        <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
      ) : (
        <AlertCircle size={18} className="text-red-400 shrink-0" />
      )}
      <span>{msg}</span>
    </motion.div>
  )
}

export const AdminPanel = ({ onExit }) => {
  const { profile, refreshSettings } = useSettings()

  const [token, setToken] = useState(() => sessionStorage.getItem('admin_token') || '')
  const [password, setPassword] = useState('')
  const [activeTab, setActiveTab] = useState('dashboard')
  const [toast, setToast] = useState(null)
  const [authLoading, setAuthLoading] = useState(false)
  const [authError, setAuthError] = useState('')

  const [projects, setProjects] = useState([])
  const [projectsLoading, setProjectsLoading] = useState(false)

  const [messages, setMessages] = useState([])
  const [messagesLoading, setMessagesLoading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const showToast = useCallback((msg, type = 'success') => {
    setToast({ msg, type, id: Date.now() })
  }, [])

  const loadProjects = useCallback(async () => {
    setProjectsLoading(true)
    try {
      const res = await fetch('/api/projects')
      if (res.ok) {
        const json = await res.json()
        setProjects(json.data || [])
      }
    } catch {
    } finally {
      setProjectsLoading(false)
    }
  }, [])

  const loadMessages = useCallback(async () => {
    setMessagesLoading(true)
    try {
      const res = await fetch('/api/contact/admin/messages')
      if (res.ok) {
        const json = await res.json()
        setMessages(json.data || [])
      }
    } catch {
    } finally {
      setMessagesLoading(false)
    }
  }, [])

  const handleRefreshAll = async () => {
    setIsRefreshing(true)
    await Promise.all([loadProjects(), loadMessages(), refreshSettings()])
    setIsRefreshing(false)
    showToast('All portfolio data synchronized with server', 'info')
  }

  useEffect(() => {
    if (token) {
      loadProjects()
      loadMessages()
    }
  }, [token, loadProjects, loadMessages])

  const handleLogin = async (e) => {
    e.preventDefault()
    setAuthLoading(true)
    setAuthError('')
    try {
      const res = await fetch('/api/settings/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.message || 'Authentication failed')

      sessionStorage.setItem('admin_token', json.token)
      setToken(json.token)
      showToast('Welcome to your Admin Management Hub!', 'success')
    } catch (err) {
      setAuthError(err.message)
    } finally {
      setAuthLoading(false)
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('admin_token')
    setToken('')
    showToast('Admin session locked', 'info')
  }

  // 1. If not authenticated, render clean login gate
  if (!token) {
    return (
      <div className="min-h-screen bg-theme-canvas text-theme-base flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-theme-card rounded-[22px] border border-theme p-8 shadow-2xl"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-theme-canvas rounded-2xl border border-theme text-theme-primary">
              <Lock size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-theme-base tracking-tight">Admin Console</h1>
              <p className="text-theme-muted text-xs font-mono">{profile?.name || 'Vivek Kumar'} Portfolio</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-theme-muted mb-1.5 block">
                Admin Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password (default: Admin123!)"
                required
                className="w-full bg-theme-canvas border border-theme rounded-xl px-4 py-3 text-theme-base text-sm focus:outline-none focus:border-theme-primary transition-all font-mono"
              />
            </div>

            {authError && <p className="text-red-400 text-xs">{authError}</p>}

            <button
              type="submit"
              disabled={authLoading}
              className="w-full gradient-primary text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 text-sm shadow-lg cursor-pointer disabled:opacity-60 transition-all hover:opacity-95"
            >
              {authLoading ? <Loader2 size={18} className="animate-spin" /> : <Lock size={16} />}
              <span>{authLoading ? 'Verifying...' : 'Unlock Admin Panel'}</span>
            </button>

            <button
              type="button"
              onClick={onExit}
              className="w-full text-theme-muted hover:text-white text-xs font-mono transition-colors pt-2 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft size={14} /> Return to Public Website
            </button>
          </form>
        </motion.div>
      </div>
    )
  }

  const unreadMessagesCount = messages.filter((m) => !m.isRead).length

  // 2. Render SaaS-grade Admin Layout with active Section
  return (
    <AdminLayout
      activeTab={activeTab}
      onSelectTab={setActiveTab}
      unreadCount={unreadMessagesCount}
      onExit={onExit}
      onLogout={handleLogout}
      onRefreshAll={handleRefreshAll}
      isRefreshing={isRefreshing}
    >
      {activeTab === 'dashboard' && (
        <DashboardSection
          projects={projects}
          messages={messages}
          onNavigateTab={setActiveTab}
        />
      )}

      {activeTab === 'profile' && <ProfileSettingsSection onToast={showToast} />}

      {activeTab === 'theme' && <ThemeSettingsSection onToast={showToast} />}

      {activeTab === 'projects' && (
        <ProjectsSection
          projects={projects}
          loading={projectsLoading}
          onReload={loadProjects}
          onToast={showToast}
        />
      )}

      {activeTab === 'messages' && (
        <MessagesSection
          messages={messages}
          loading={messagesLoading}
          onReload={loadMessages}
          onToast={showToast}
        />
      )}

      {activeTab === 'socials' && <SocialsSettingsSection onToast={showToast} />}

      {activeTab === 'account' && <AccountSettingsSection onToast={showToast} onLogout={handleLogout} />}

      <AnimatePresence>
        {toast && <Toast key={toast.id} msg={toast.msg} type={toast.type} onDone={() => setToast(null)} />}
      </AnimatePresence>
    </AdminLayout>
  )
}

export default AdminPanel
