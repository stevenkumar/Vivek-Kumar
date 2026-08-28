import React, { useState } from 'react'
import { User, Save, Loader2, MapPin, Briefcase } from 'lucide-react'
import AdminCard from '../ui/AdminCard'
import { useSettings } from '../../../context/SettingsContext'

export const ProfileSettingsSection = ({ onToast }) => {
  const { settings, profile, updateProfile, saveSettingsToServer } = useSettings()
  const [profileForm, setProfileForm] = useState(profile)
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    updateProfile(profileForm)
    const result = await saveSettingsToServer({ ...settings, profile: profileForm })
    setSaving(false)
    if (result.success) {
      onToast('Profile information updated successfully!', 'success')
    } else {
      onToast(result.error || 'Failed to save profile', 'error')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
      <AdminCard
        title="Personal Details & Bio"
        subtitle="Manage your public presentation, headline, location, and career achievements"
        icon={User}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-theme-muted mb-2 block">
              Display Name *
            </label>
            <input
              type="text"
              required
              value={profileForm.name || ''}
              onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
              className="w-full bg-theme-canvas border border-theme rounded-xl px-4 py-3 text-sm text-theme-base focus:outline-none focus:border-theme-primary transition-all"
            />
          </div>

          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-theme-muted mb-2 block">
              Professional Role / Title *
            </label>
            <input
              type="text"
              required
              value={profileForm.role || ''}
              onChange={(e) => setProfileForm({ ...profileForm, role: e.target.value })}
              className="w-full bg-theme-canvas border border-theme rounded-xl px-4 py-3 text-sm text-theme-base focus:outline-none focus:border-theme-primary transition-all"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-xs font-mono uppercase tracking-wider text-theme-muted mb-2 block">
              Hero Greeting Tagline
            </label>
            <input
              type="text"
              value={profileForm.tagline || ''}
              onChange={(e) => setProfileForm({ ...profileForm, tagline: e.target.value })}
              className="w-full bg-theme-canvas border border-theme rounded-xl px-4 py-3 text-sm text-theme-base focus:outline-none focus:border-theme-primary transition-all"
            />
          </div>

          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-theme-muted mb-2 block">
              Location / City
            </label>
            <div className="relative">
              <input
                type="text"
                value={profileForm.location || ''}
                onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                className="w-full bg-theme-canvas border border-theme rounded-xl px-4 py-3 text-sm text-theme-base focus:outline-none focus:border-theme-primary transition-all"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-theme-muted mb-2 block">
              Availability Status
            </label>
            <div className="flex items-center gap-3 p-3 bg-theme-canvas border border-theme rounded-xl">
              <input
                type="checkbox"
                id="openToWork"
                checked={Boolean(profileForm.openToWork)}
                onChange={(e) => setProfileForm({ ...profileForm, openToWork: e.target.checked })}
                className="w-5 h-5 rounded accent-cyan-400 cursor-pointer"
              />
              <label htmlFor="openToWork" className="text-sm font-semibold text-theme-base cursor-pointer">
                {profileForm.openToWork ? 'Available & Open to Work' : 'Currently Engaged'}
              </label>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="text-xs font-mono text-theme-muted mb-1 block">Years of Experience</label>
              <input
                type="text"
                value={profileForm.experienceYears || ''}
                onChange={(e) => setProfileForm({ ...profileForm, experienceYears: e.target.value })}
                placeholder="2+"
                className="w-full bg-theme-canvas border border-theme rounded-xl px-3 py-2.5 text-sm text-theme-base focus:outline-none focus:border-theme-primary font-mono"
              />
            </div>
            <div>
              <label className="text-xs font-mono text-theme-muted mb-1 block">Completed Projects</label>
              <input
                type="text"
                value={profileForm.completedProjects || ''}
                onChange={(e) => setProfileForm({ ...profileForm, completedProjects: e.target.value })}
                placeholder="15+"
                className="w-full bg-theme-canvas border border-theme rounded-xl px-3 py-2.5 text-sm text-theme-base focus:outline-none focus:border-theme-primary font-mono"
              />
            </div>
            <div>
              <label className="text-xs font-mono text-theme-muted mb-1 block">Happy Clients</label>
              <input
                type="text"
                value={profileForm.happyClients || ''}
                onChange={(e) => setProfileForm({ ...profileForm, happyClients: e.target.value })}
                placeholder="10+"
                className="w-full bg-theme-canvas border border-theme rounded-xl px-3 py-2.5 text-sm text-theme-base focus:outline-none focus:border-theme-primary font-mono"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="text-xs font-mono uppercase tracking-wider text-theme-muted mb-2 block">
              Short Biography (Who I Am)
            </label>
            <textarea
              rows={4}
              value={profileForm.bio || ''}
              onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
              className="w-full bg-theme-canvas border border-theme rounded-xl p-4 text-sm text-theme-base focus:outline-none focus:border-theme-primary resize-none leading-relaxed"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-xs font-mono uppercase tracking-wider text-theme-muted mb-2 block">
              Full Personal Story
            </label>
            <textarea
              rows={5}
              value={profileForm.story || ''}
              onChange={(e) => setProfileForm({ ...profileForm, story: e.target.value })}
              className="w-full bg-theme-canvas border border-theme rounded-xl p-4 text-sm text-theme-base focus:outline-none focus:border-theme-primary resize-none leading-relaxed"
            />
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-theme flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 gradient-primary text-white font-bold px-8 py-3.5 rounded-xl text-sm shadow-lg cursor-pointer disabled:opacity-60 transition-all hover:opacity-95"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            <span>Save Profile Settings</span>
          </button>
        </div>
      </AdminCard>
    </form>
  )
}

export default ProfileSettingsSection
