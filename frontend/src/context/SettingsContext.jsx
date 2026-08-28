import React, { createContext, useContext, useState, useEffect } from 'react'
import { DEFAULT_THEME, applyThemeToRoot } from '../config/theme.config'

const DEFAULT_PROFILE = {
  name: 'Vivek Kumar',
  role: 'Webdesigner & Programmer',
  tagline: '👋, my name is Vivek Kumar and I am a freelance',
  location: 'Mumbai, India',
  email: 'vkvseri@gmail.com',
  bio: "Hi, I'm Vivek Kumar — a Frontend Developer at Tekunik who's passionate about building web experiences that don't just work, but feel right. I focus on creating fast, clean, and visually engaging interfaces using modern tools like React, Next.js, and Tailwind CSS.\n\nFor me, frontend development isn't just about writing code — it's about shaping how people interact with a product.",
  story: "I like to think my story starts like a slow, warm movie scene — sunlight over open fields in Ballia, Uttar Pradesh. Life there wasn't rushed. It had its own rhythm.\n\nIn 9th grade, I moved to Mumbai. It felt like stepping into a completely different world. The quiet fields were replaced by crowded streets, fast-moving people, and the constant rush of local trains.\n\nToday, I describe myself as a 'village soul with a high-speed city processor.' I stay patient when solving problems, but adapt quickly when things get complex.",
  openToWork: true,
  experienceYears: '2+',
  completedProjects: '15+',
  happyClients: '10+',
}

const DEFAULT_SOCIALS = {
  github: 'https://github.com/stevenkumar',
  linkedin: 'https://www.linkedin.com/in/vivek-kumar-733552317/',
  twitter: 'https://x.com/Vivek9653',
  email: 'vkvseri@gmail.com',
  resumeUrl: './home/Vivek_ Resume_2026.pdf',
}

const SettingsContext = createContext(null)

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('portfolio_settings')
      if (saved) {
        const parsed = JSON.parse(saved)
        return {
          profile: { ...DEFAULT_PROFILE, ...(parsed.profile || {}) },
          socials: { ...DEFAULT_SOCIALS, ...(parsed.socials || {}) },
          theme: { ...DEFAULT_THEME, ...(parsed.theme || {}) },
        }
      }
    } catch {}
    return {
      profile: DEFAULT_PROFILE,
      socials: DEFAULT_SOCIALS,
      theme: DEFAULT_THEME,
    }
  })
  const [loading, setLoading] = useState(true)

  // Fetch settings from server-side JSON
  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings')
      if (res.ok) {
        const json = await res.json()
        if (json.success && json.data) {
          const merged = {
            profile: { ...DEFAULT_PROFILE, ...(json.data.profile || {}) },
            socials: { ...DEFAULT_SOCIALS, ...(json.data.socials || {}) },
            theme: { ...DEFAULT_THEME, ...(json.data.theme || {}) },
          }
          setSettings(merged)
          localStorage.setItem('portfolio_settings', JSON.stringify(merged))
          applyThemeToRoot(merged.theme)
        }
      }
    } catch (err) {
      console.warn('Could not load /api/settings from server, using local fallback:', err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    applyThemeToRoot(settings.theme)
    fetchSettings()
  }, [])

  const updateTheme = (newTheme) => {
    setSettings((prev) => {
      const updated = {
        ...prev,
        theme: { ...prev.theme, ...newTheme },
      }
      applyThemeToRoot(updated.theme)
      localStorage.setItem('portfolio_settings', JSON.stringify(updated))
      return updated
    })
  }

  const updateProfile = (newProfile) => {
    setSettings((prev) => {
      const updated = {
        ...prev,
        profile: { ...prev.profile, ...newProfile },
      }
      localStorage.setItem('portfolio_settings', JSON.stringify(updated))
      return updated
    })
  }

  const updateSocials = (newSocials) => {
    setSettings((prev) => {
      const updated = {
        ...prev,
        socials: { ...prev.socials, ...newSocials },
      }
      localStorage.setItem('portfolio_settings', JSON.stringify(updated))
      return updated
    })
  }

  const saveSettingsToServer = async (customPayload = null) => {
    const payload = customPayload || settings
    try {
      const res = await fetch('/api/settings/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.message || 'Failed to save settings to server')
      }
      const data = await res.json()
      if (data.success && data.data) {
        setSettings(data.data)
        applyThemeToRoot(data.data.theme)
        localStorage.setItem('portfolio_settings', JSON.stringify(data.data))
      }
      return { success: true }
    } catch (err) {
      console.error('Save error:', err)
      return { success: false, error: err.message }
    }
  }

  return (
    <SettingsContext.Provider
      value={{
        settings,
        profile: settings.profile,
        socials: settings.socials,
        theme: settings.theme,
        updateTheme,
        updateProfile,
        updateSocials,
        saveSettingsToServer,
        refreshSettings: fetchSettings,
        loading,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettings = () => {
  const context = useContext(SettingsContext)
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}
