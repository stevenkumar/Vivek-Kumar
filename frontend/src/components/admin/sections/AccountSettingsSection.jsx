import React, { useState } from 'react'
import { ShieldCheck, Lock, Key, Loader2, Save, CheckCircle2, AlertCircle } from 'lucide-react'
import AdminCard from '../ui/AdminCard'

export const AccountSettingsSection = ({ onToast, onLogout }) => {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    setError('')

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match')
      return
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/settings/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      })
      const json = await res.json()

      if (!res.ok) throw new Error(json.message || 'Failed to update password')

      if (json.token) {
        sessionStorage.setItem('admin_token', json.token)
      }

      onToast('Admin password updated successfully!', 'success')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      setError(err.message)
      onToast(err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <AdminCard
        title="Admin Password & Security"
        subtitle="Manage your dashboard login password and session security"
        icon={ShieldCheck}
      >
        <form onSubmit={handlePasswordChange} className="space-y-5">
          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-theme-muted mb-1.5 block">
              Current Admin Password *
            </label>
            <input
              type="password"
              required
              placeholder="Enter current password (default: Admin123!)"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full bg-theme-canvas border border-theme rounded-xl px-4 py-3 text-sm text-theme-base focus:outline-none focus:border-theme-primary transition-all font-mono"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-theme-muted mb-1.5 block">
                New Password *
              </label>
              <input
                type="password"
                required
                placeholder="Min 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-theme-canvas border border-theme rounded-xl px-4 py-3 text-sm text-theme-base focus:outline-none focus:border-theme-primary transition-all font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-theme-muted mb-1.5 block">
                Confirm New Password *
              </label>
              <input
                type="password"
                required
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-theme-canvas border border-theme rounded-xl px-4 py-3 text-sm text-theme-base focus:outline-none focus:border-theme-primary transition-all font-mono"
              />
            </div>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle size={15} className="shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <div className="pt-4 border-t border-theme flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 gradient-primary text-white font-bold px-7 py-3 rounded-xl text-xs sm:text-sm shadow-lg cursor-pointer disabled:opacity-60 transition-all hover:opacity-95"
            >
              {loading ? <Loader2 size={15} className="animate-spin" /> : <Key size={15} />}
              <span>Update Admin Password</span>
            </button>
          </div>
        </form>
      </AdminCard>

      {/* Session Security Overview */}
      <AdminCard title="Session & Architecture Info" subtitle="Zero database hosting compatibility" icon={Lock}>
        <div className="space-y-3 text-xs">
          <div className="p-3 rounded-xl bg-theme-canvas border border-theme flex items-center justify-between">
            <span className="text-theme-muted">Persistence Strategy</span>
            <span className="font-bold text-theme-primary font-mono">File-Based JSON Storage</span>
          </div>
          <div className="p-3 rounded-xl bg-theme-canvas border border-theme flex items-center justify-between">
            <span className="text-theme-muted">Hosting Compatibility</span>
            <span className="font-bold text-emerald-400 font-mono">cPanel / Node VPS / Localhost</span>
          </div>
          <div className="p-3 rounded-xl bg-theme-canvas border border-theme flex items-center justify-between">
            <span className="text-theme-muted">Authentication Mode</span>
            <span className="font-bold text-theme-base font-mono">Session Token Guard</span>
          </div>
        </div>
      </AdminCard>
    </div>
  )
}

export default AccountSettingsSection
