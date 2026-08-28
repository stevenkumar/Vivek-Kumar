import React, { useState, useEffect } from 'react'
import { Palette, Sparkles, Save, Loader2, RefreshCw } from 'lucide-react'
import AdminCard from '../ui/AdminCard'
import { useSettings } from '../../../context/SettingsContext'
import { THEME_PRESETS, DEFAULT_THEME } from '../../../config/theme.config'

export const ThemeSettingsSection = ({ onToast }) => {
  const { settings, theme, updateTheme, saveSettingsToServer } = useSettings()
  const [themeForm, setThemeForm] = useState(theme)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setThemeForm(theme)
  }, [theme])

  const handleApplyPreset = (preset) => {
    setThemeForm(preset)
    updateTheme(preset)
  }

  const handleColorChange = (key, val) => {
    const updated = { ...themeForm, [key]: val }
    setThemeForm(updated)
    updateTheme(updated)
  }

  const handleReset = () => {
    setThemeForm(DEFAULT_THEME)
    updateTheme(DEFAULT_THEME)
    onToast('Reset to default Home page theme!', 'info')
  }

  const handleSave = async (e) => {
    e?.preventDefault()
    setSaving(true)
    updateTheme(themeForm)
    const result = await saveSettingsToServer({ ...settings, theme: themeForm })
    setSaving(false)
    if (result.success) {
      onToast('Theme colors saved & synchronized globally!', 'success')
    } else {
      onToast(result.error || 'Failed to save theme', 'error')
    }
  }

  const colorFields = [
    { key: 'primaryColor', label: 'Primary Accent Color', desc: 'Main highlights, cyan badges, glowing borders, active buttons' },
    { key: 'secondaryColor', label: 'Secondary Accent Color', desc: 'Gradient companion, secondary CTA elements' },
    { key: 'accentColor', label: 'Highlight / Sparkle Color', desc: 'Tertiary accents, icons, and sparkles' },
    { key: 'bgColor', label: 'Canvas Background Color', desc: 'Main full-page canvas background' },
    { key: 'cardBgColor', label: 'Card Surface Color', desc: 'Project cards, terminal background, section containers' },
    { key: 'textColor', label: 'Heading Text Color', desc: 'Primary typography & titles' },
    { key: 'mutedTextColor', label: 'Muted Text Color', desc: 'Subtitles, descriptions, metadata' },
  ]

  return (
    <div className="space-y-10">
      {/* Palette Presets */}
      <AdminCard
        title="Theme Palette Presets"
        subtitle="Click any curated palette for instant real-time styling"
        icon={Sparkles}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {THEME_PRESETS.map((p) => {
            const isSelected = themeForm.primaryColor?.toLowerCase() === p.primaryColor.toLowerCase()
            return (
              <button
                key={p.name}
                type="button"
                onClick={() => handleApplyPreset(p)}
                className={`flex items-center justify-between p-4 rounded-2xl bg-theme-canvas border transition-all text-left group cursor-pointer ${
                  isSelected ? 'border-theme-primary ring-1 ring-cyan-500/40' : 'border-theme hover:border-theme-primary'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-theme-base group-hover:text-theme-primary transition-colors">{p.name}</p>
                    {isSelected && <span className="text-[10px] font-mono text-emerald-400 font-bold">ACTIVE</span>}
                  </div>
                  <p className="text-[11px] font-mono text-theme-muted">{p.primaryColor}</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="w-5 h-5 rounded-full border border-white/20 shadow-md" style={{ backgroundColor: p.primaryColor }} />
                  <span className="w-5 h-5 rounded-full border border-white/20 shadow-md" style={{ backgroundColor: p.secondaryColor }} />
                  <span className="w-5 h-5 rounded-full border border-white/20 shadow-md" style={{ backgroundColor: p.bgColor }} />
                </div>
              </button>
            )
          })}
        </div>
      </AdminCard>

      {/* Custom Pickers & Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Color Pickers */}
        <div className="lg:col-span-7">
          <AdminCard
            title="Custom Design Tokens"
            subtitle="Adjust hex values with instant zero-delay DOM reactivity"
            icon={Palette}
          >
            <div className="space-y-4">
              {colorFields.map((field) => (
                <div
                  key={field.key}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-theme-canvas border border-theme gap-4"
                >
                  <div>
                    <p className="text-sm font-bold text-theme-base">{field.label}</p>
                    <p className="text-xs text-theme-muted">{field.desc}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <input
                      type="color"
                      value={themeForm[field.key] || '#000000'}
                      onChange={(e) => handleColorChange(field.key, e.target.value)}
                      className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border-0"
                    />
                    <input
                      type="text"
                      value={themeForm[field.key] || ''}
                      onChange={(e) => handleColorChange(field.key, e.target.value)}
                      className="w-24 bg-theme-card border border-theme rounded-lg px-2.5 py-1.5 text-xs font-mono text-theme-base text-center focus:outline-none focus:border-theme-primary"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-theme flex items-center justify-between">
              <button
                type="button"
                onClick={handleReset}
                className="text-xs text-theme-muted hover:text-white transition-colors cursor-pointer"
              >
                Reset to Defaults
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 gradient-primary text-white font-bold px-7 py-3 rounded-xl text-sm shadow-lg cursor-pointer disabled:opacity-60 transition-all hover:opacity-95"
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                <span>Save Theme Globally</span>
              </button>
            </div>
          </AdminCard>
        </div>

        {/* Live Interactive Preview Card */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-theme-card rounded-[22px] border border-theme p-6 sm:p-8 shadow-2xl sticky top-24">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-theme">
              <h3 className="text-base font-bold text-theme-base">Live Component Preview</h3>
              <span className="text-[10px] font-mono uppercase tracking-widest text-theme-primary px-2.5 py-0.5 rounded-full bg-theme-canvas border border-theme font-bold">
                CSS Engine
              </span>
            </div>

            <div
              className="rounded-2xl p-6 border shadow-2xl transition-all space-y-4"
              style={{
                backgroundColor: themeForm.cardBgColor,
                borderColor: 'rgba(255,255,255,0.08)',
              }}
            >
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border"
                style={{
                  backgroundColor: 'rgba(6, 182, 212, 0.1)',
                  color: themeForm.primaryColor,
                  borderColor: themeForm.primaryColor,
                }}
              >
                <span>Live Preview Badge</span>
              </div>

              <h4 className="text-xl font-bold tracking-tight" style={{ color: themeForm.textColor }}>
                Interactive UI Component
              </h4>

              <p className="text-xs leading-relaxed font-normal" style={{ color: themeForm.mutedTextColor }}>
                This card reflects your selected theme tokens immediately so you can preview the appearance before saving globally.
              </p>

              <div className="flex flex-wrap gap-2 pt-2">
                {['React 19', 'Next.js', 'Tailwind'].map((t) => (
                  <span
                    key={t}
                    className="text-[10px] px-2.5 py-1 rounded-md font-mono flex items-center gap-1.5 border"
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.05)',
                      color: themeForm.textColor,
                      borderColor: 'rgba(255,255,255,0.1)',
                    }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: themeForm.primaryColor }} />
                    {t}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-white transition-all shadow-md"
                  style={{
                    background: `linear-gradient(135deg, ${themeForm.secondaryColor}, ${themeForm.primaryColor})`,
                  }}
                >
                  Primary Action
                </button>
                <button
                  type="button"
                  className="py-2.5 px-4 rounded-xl text-xs font-semibold border transition-all"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    color: themeForm.textColor,
                    borderColor: 'rgba(255,255,255,0.1)',
                  }}
                >
                  Secondary
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ThemeSettingsSection
