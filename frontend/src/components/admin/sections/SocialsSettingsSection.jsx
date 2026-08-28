import React, { useState, useRef } from 'react'
import {
  Share2,
  Save,
  Loader2,
  Github,
  Linkedin,
  Twitter,
  Mail,
  FileText,
  UploadCloud,
  FileCheck,
  Eye,
  ExternalLink,
  Instagram,
  Youtube,
  Trash2,
} from 'lucide-react'
import AdminCard from '../ui/AdminCard'
import { useSettings } from '../../../context/SettingsContext'

export const SocialsSettingsSection = ({ onToast }) => {
  const { settings, socials, updateSocials, saveSettingsToServer } = useSettings()
  const [socialsForm, setSocialsForm] = useState(socials)
  const [saving, setSaving] = useState(false)
  const [uploadingResume, setUploadingResume] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef(null)

  const socialConfig = [
    { key: 'github', label: 'GitHub Profile', icon: Github, placeholder: 'https://github.com/stevenkumar' },
    { key: 'linkedin', label: 'LinkedIn Profile', icon: Linkedin, placeholder: 'https://www.linkedin.com/in/vivek-kumar-733552317/' },
    { key: 'twitter', label: 'X (Twitter) Profile', icon: Twitter, placeholder: 'https://x.com/Vivek9653' },
    { key: 'instagram', label: 'Instagram Profile', icon: Instagram, placeholder: 'https://instagram.com/...' },
    { key: 'youtube', label: 'YouTube Channel', icon: Youtube, placeholder: 'https://youtube.com/@...' },
    { key: 'email', label: 'Direct Email Address', icon: Mail, placeholder: 'vkvseri@gmail.com' },
  ]

  const handleFileUpload = async (file) => {
    if (!file) return

    const allowed = ['.pdf', '.doc', '.docx']
    const ext = '.' + file.name.split('.').pop().toLowerCase()
    if (!allowed.includes(ext) && file.type !== 'application/pdf') {
      onToast('Please select a valid PDF, DOC, or DOCX document', 'error')
      return
    }

    if (file.size > 15 * 1024 * 1024) {
      onToast('File size must be under 15MB', 'error')
      return
    }

    setUploadingResume(true)
    try {
      const formData = new FormData()
      formData.append('resume', file)

      const res = await fetch('/api/settings/admin/upload-resume', {
        method: 'POST',
        body: formData,
      })

      const json = await res.json()
      if (!res.ok) throw new Error(json.message || 'Upload failed')

      const newSocials = { ...socialsForm, resumeUrl: json.url }
      setSocialsForm(newSocials)
      updateSocials(newSocials)
      onToast(json.message || 'Resume uploaded successfully!', 'success')
    } catch (err) {
      onToast(err.message, 'error')
    } finally {
      setUploadingResume(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) handleFileUpload(file)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFileUpload(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    updateSocials(socialsForm)
    const result = await saveSettingsToServer({ ...settings, socials: socialsForm })
    setSaving(false)
    if (result.success) {
      onToast('Social channels and resume settings saved!', 'success')
    } else {
      onToast(result.error || 'Failed to save socials', 'error')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
      {/* Resume Document Upload Card */}
      <AdminCard
        title="Resume & CV Document Manager"
        subtitle="Upload your latest resume PDF directly from your mobile phone or laptop/desktop"
        icon={FileText}
      >
        <div className="space-y-5">
          {/* Mobile & Desktop Upload Zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault()
              setIsDragOver(true)
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all ${
              isDragOver
                ? 'border-theme-primary bg-cyan-950/20'
                : 'border-theme hover:border-theme-primary bg-theme-canvas/60 hover:bg-theme-canvas'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="flex flex-col items-center justify-center space-y-3">
              <div className="p-4 rounded-2xl bg-theme-canvas border border-theme text-theme-primary shadow-lg">
                {uploadingResume ? (
                  <Loader2 size={28} className="animate-spin text-theme-primary" />
                ) : (
                  <UploadCloud size={28} />
                )}
              </div>

              <div>
                <p className="font-bold text-theme-base text-sm sm:text-base">
                  {uploadingResume
                    ? 'Uploading Resume PDF...'
                    : 'Tap here to upload from Mobile or Desktop'}
                </p>
                <p className="text-xs text-theme-muted mt-1">
                  Supports PDF, DOC, DOCX (up to 15MB). Works natively with iPhone Files, Android, and Desktop Explorer.
                </p>
              </div>

              <button
                type="button"
                disabled={uploadingResume}
                className="gradient-primary text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md cursor-pointer hover:opacity-95 transition"
              >
                {uploadingResume ? 'Processing File...' : 'Choose File to Upload'}
              </button>
            </div>
          </div>

          {/* Current Active Resume Status */}
          {socialsForm.resumeUrl && (
            <div className="p-4 rounded-xl bg-theme-canvas border border-theme flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 shrink-0">
                  <FileCheck size={20} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
                    Active Resume Connected
                  </p>
                  <p className="text-xs text-theme-muted font-mono truncate">{socialsForm.resumeUrl}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <a
                  href={socialsForm.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-theme-card border border-theme text-xs font-bold text-theme-base hover:text-theme-primary transition cursor-pointer"
                >
                  <Eye size={14} />
                  <span>Preview PDF</span>
                  <ExternalLink size={10} />
                </a>
              </div>
            </div>
          )}

          {/* Fallback Custom URL Input */}
          <div className="pt-2">
            <label className="text-xs font-mono uppercase tracking-wider text-theme-muted mb-1.5 block">
              Direct Resume File Path or Custom URL
            </label>
            <input
              type="text"
              value={socialsForm.resumeUrl || ''}
              onChange={(e) => setSocialsForm({ ...socialsForm, resumeUrl: e.target.value })}
              placeholder="./home/Vivek_ Resume_2026.pdf or https://drive.google.com/..."
              className="w-full bg-theme-canvas border border-theme rounded-xl px-4 py-3 text-xs font-mono text-theme-base focus:outline-none focus:border-theme-primary transition-all"
            />
          </div>
        </div>
      </AdminCard>

      {/* Social Media Links Card */}
      <AdminCard
        title="Social Media Profiles"
        subtitle="Manage the links connected to your header, footer, and interactive developer CLI terminal"
        icon={Share2}
      >
        <div className="space-y-4">
          {socialConfig.map((item) => {
            const Icon = item.icon
            return (
              <div key={item.key} className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-theme-muted flex items-center gap-2">
                  <Icon size={14} className="text-theme-primary" />
                  <span>{item.label}</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={socialsForm[item.key] || ''}
                    onChange={(e) => setSocialsForm({ ...socialsForm, [item.key]: e.target.value })}
                    placeholder={item.placeholder}
                    className="w-full bg-theme-canvas border border-theme rounded-xl px-4 py-3 text-sm text-theme-base focus:outline-none focus:border-theme-primary transition-all font-mono"
                  />
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-8 pt-6 border-t border-theme flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 gradient-primary text-white font-bold px-8 py-3.5 rounded-xl text-sm shadow-lg cursor-pointer disabled:opacity-60 transition-all hover:opacity-95"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            <span>Save All Changes</span>
          </button>
        </div>
      </AdminCard>
    </form>
  )
}

export default SocialsSettingsSection
