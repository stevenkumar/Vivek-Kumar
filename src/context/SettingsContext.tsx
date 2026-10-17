import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { DEFAULT_THEME, applyThemeToRoot, ThemeConfig } from '../config/theme.config'

export interface ProfileSettings {
  name: string
  role: string
  tagline: string
  location: string
  bio: string
  story: string
  openToWork: boolean
  experienceYears: string
  completedProjects: string
  happyClients: string
}

export interface SocialLinks {
  github: string
  linkedin: string
  twitter: string
  email: string
  resumeUrl: string
}

export interface PortfolioSettings {
  profile: ProfileSettings
  socials: SocialLinks
  theme: ThemeConfig
}

export interface SettingsContextType {
  settings: PortfolioSettings
  theme: ThemeConfig
  socials: SocialLinks
  profile: ProfileSettings
  updateTheme: (newTheme: Partial<ThemeConfig>) => void
  updateSocials: (newSocials: Partial<SocialLinks>) => void
  updateProfile: (newProfile: Partial<ProfileSettings>) => void
}

const DEFAULT_PROFILE: ProfileSettings = {
  name: 'Vivek Kumar',
  role: 'Software & Product Engineer',
  tagline: "👋 Hi, I'm Vivek Kumar — Full-Stack & Frontend",
  location: 'Mumbai, India',
  bio: `Hi, I'm **Vivek Kumar** — a Frontend & Full-Stack Developer at **Tekunik** who's passionate about building web experiences that don't just work, but *feel right*. I focus on creating fast, clean, and visually engaging interfaces using modern tools like **React**, **Next.js**, **TypeScript**, and **Tailwind CSS**.

For me, software development isn't just about writing code — it's about shaping how people interact with a product, bridging clean engineering with intuitive human-centric design.`,
  story: `### BookHaven
**My First Project**

BookHaven was my first project and the beginning of my journey as a developer. It gave me the opportunity to move from learning concepts to actually building something of my own. Through this project, I learned how to structure an application, solve problems through code, and turn an idea into a working product.

**What it represents:** The beginning of my development journey.

---

### Tekunik
**Professional Office Project**

Tekunik was a professional project that introduced me to real-world development requirements and delivery expectations. I successfully completed and delivered the project on time. After development, I also took the next step by deploying the application on cPanel, which helped me gain practical experience with hosting, configuration, and deployment.

**What it represents:** Learning how to build and deliver a real project.

---

### TekDoctor
**My Most Ambitious Project**

TekDoctor is a comprehensive device repair and service management platform and my most ambitious project so far. It includes multiple user roles, dashboards, repair workflows, authentication, service management, notifications, payments, invoicing, and other interconnected features.

Because of its larger scope, I have taken more time to complete it properly. During its development, I have also been learning how to deploy and maintain applications, while improving my understanding of backend architecture, databases, security, workflows, and production readiness.

For me, TekDoctor is more than another project—it is an ongoing learning experience that is helping me understand how a complete software product is designed, developed, connected, deployed, and maintained.

**What it represents:** Growing from a developer who builds features into a developer who thinks about complete products.`,
  openToWork: true,
  experienceYears: '2+',
  completedProjects: '4+',
  happyClients: '2+',
}

const DEFAULT_SOCIALS: SocialLinks = {
  github: 'https://github.com/stevenkumar',
  linkedin: 'https://www.linkedin.com/in/vivek-kumar-733552317/',
  twitter: 'https://x.com/Vivek9653',
  email: 'vkvseri@gmail.com',
  resumeUrl: './home/Vivek_%20Resume_2026.pdf',
}

const SettingsContext = createContext<SettingsContextType | null>(null)

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<PortfolioSettings>(() => {
    try {
      const saved = localStorage.getItem('portfolio_settings')
      if (saved) {
        const parsed = JSON.parse(saved)
        const savedStory = parsed.profile?.story
        const isDirtyStory =
          !savedStory ||
          savedStory.includes('<br') ||
          savedStory.includes('slow, warm movie scene')

        const savedBio = parsed.profile?.bio
        const isOldBio = !savedBio || savedBio.startsWith("Hi, I'm Vivek Kumar — a Frontend Developer at Tekunik")

        const savedTagline = parsed.profile?.tagline
        const isOldTagline = !savedTagline || savedTagline.includes('freelance')

        const savedRole = parsed.profile?.role
        const isOldRole = !savedRole || savedRole.includes('Webdesigner')

        const savedResume = parsed.socials?.resumeUrl
        const isOldResume = !savedResume || savedResume.includes(' ')

        return {
          profile: {
            ...DEFAULT_PROFILE,
            ...(parsed.profile || {}),
            role: isOldRole ? DEFAULT_PROFILE.role : savedRole,
            tagline: isOldTagline ? DEFAULT_PROFILE.tagline : savedTagline,
            bio: isOldBio ? DEFAULT_PROFILE.bio : savedBio,
            story: isDirtyStory ? DEFAULT_PROFILE.story : savedStory,
          },
          socials: {
            ...DEFAULT_SOCIALS,
            ...(parsed.socials || {}),
            resumeUrl: isOldResume ? DEFAULT_SOCIALS.resumeUrl : savedResume,
          },
          theme: { ...DEFAULT_THEME, ...(parsed.theme || {}) },
        }
      }
    } catch {
      // Ignore JSON parse errors and fallback
    }
    return {
      profile: DEFAULT_PROFILE,
      socials: DEFAULT_SOCIALS,
      theme: DEFAULT_THEME,
    }
  })

  useEffect(() => {
    applyThemeToRoot(settings.theme)
  }, [settings.theme])

  const updateTheme = (newTheme: Partial<ThemeConfig>) => {
    setSettings((prev) => {
      const updated: PortfolioSettings = {
        ...prev,
        theme: { ...prev.theme, ...newTheme },
      }
      applyThemeToRoot(updated.theme)
      localStorage.setItem('portfolio_settings', JSON.stringify(updated))
      return updated
    })
  }

  const updateSocials = (newSocials: Partial<SocialLinks>) => {
    setSettings((prev) => {
      const updated: PortfolioSettings = {
        ...prev,
        socials: { ...prev.socials, ...newSocials },
      }
      localStorage.setItem('portfolio_settings', JSON.stringify(updated))
      return updated
    })
  }

  const updateProfile = (newProfile: Partial<ProfileSettings>) => {
    setSettings((prev) => {
      const updated: PortfolioSettings = {
        ...prev,
        profile: { ...prev.profile, ...newProfile },
      }
      localStorage.setItem('portfolio_settings', JSON.stringify(updated))
      return updated
    })
  }

  return (
    <SettingsContext.Provider
      value={{
        settings,
        theme: settings.theme,
        socials: settings.socials,
        profile: settings.profile,
        updateTheme,
        updateSocials,
        updateProfile,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext)
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}
