import React, { createContext, useContext, useState, useEffect } from 'react'
import { DEFAULT_THEME, applyThemeToRoot } from '../config/theme.config'

const DEFAULT_PROFILE = {
  name: 'Vivek Kumar',
  role: 'Webdesigner & Programmer',
  tagline: '👋, my name is Vivek Kumar and I am a freelance',
  location: 'Mumbai, India',
  bio: `Hi, I'm **Vivek Kumar** — a Frontend Developer at **Tekunik** who's passionate about building web experiences that don't just work, but *feel right*. I focus on creating fast, clean, and visually engaging interfaces using modern tools like **React**, **Next.js**, and **Tailwind CSS**.

For me, frontend development isn't just about writing code — it's about shaping how people interact with a product, bridging clean engineering with intuitive human-centric design.`,
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
  completedProjects: '3+',
  happyClients: '2+',
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
        const savedStory = parsed.profile?.story
        const isDirtyStory =
          !savedStory ||
          savedStory.includes('<br') ||
          savedStory.includes('slow, warm movie scene')

        const savedBio = parsed.profile?.bio
        const isOldBio = !savedBio || savedBio.startsWith("Hi, I'm Vivek Kumar — a Frontend Developer at Tekunik")

        return {
          profile: {
            ...DEFAULT_PROFILE,
            ...(parsed.profile || {}),
            bio: isOldBio ? DEFAULT_PROFILE.bio : savedBio,
            story: isDirtyStory ? DEFAULT_PROFILE.story : savedStory,
          },
          socials: { ...DEFAULT_SOCIALS, ...(parsed.socials || {}) },
          theme: { ...DEFAULT_THEME, ...(parsed.theme || {}) },
        }
      }
    } catch (err) {
      void err
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

// eslint-disable-next-line react-refresh/only-export-components
export const useSettings = () => {
  const context = useContext(SettingsContext)
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}