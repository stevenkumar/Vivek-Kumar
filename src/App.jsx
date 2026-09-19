import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Header from './components/layout/Header'
import Hero from './components/sections/Hero'
import ProfileModal from './components/ui/ProfileModal'
import PencilCursor from './components/ui/PencilCursor'
import ProjectSection from './components/sections/ProjectSection'
import ContactPage from './components/sections/ContactPage'
import AboutSection from './components/sections/AboutSection'
import Footer from './components/layout/Footer'
import MasterPortfolioTimeline from './components/timeline/MasterPortfolioTimeline'
import { SettingsProvider } from './context/SettingsContext'

const getViewFromHash = () => {
  const hash = typeof window !== 'undefined' ? window.location.hash.replace('#', '') : ''
  if (['projects', 'about', 'contact'].includes(hash)) {
    return hash
  }
  return 'home'
}

function AppContent() {
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [currentView, setCurrentView] = useState(getViewFromHash)

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
  }, [])

  useEffect(() => {
    const handleHash = () => {
      const view = getViewFromHash()
      setCurrentView(view)
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
    }
    handleHash()
    window.addEventListener('hashchange', handleHash)
    return () => window.removeEventListener('hashchange', handleHash)
  }, [])

  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
    }

    scrollToTop()
    const rAF = requestAnimationFrame(scrollToTop)
    const t1 = setTimeout(scrollToTop, 50)
    const t2 = setTimeout(scrollToTop, 150)
    const t3 = setTimeout(scrollToTop, 520)

    return () => {
      cancelAnimationFrame(rAF)
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [currentView])

  const handleOpenProfile = () => setIsProfileOpen(true)
  const handleCloseProfile = () => setIsProfileOpen(false)

  const handleNavigate = (view) => {
    setCurrentView(view)
    if (view === 'home') {
      window.history.replaceState(null, '', ' ')
    } else {
      window.location.hash = `#${view}`
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  }

  const handleNavigateHome = () => handleNavigate('home')
  const handleNavigateToContact = () => handleNavigate('contact')

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  }

  const pageTransition = { duration: 0.5, ease: 'easeInOut' }

  return (
    <>
      <PencilCursor />
      <div className="min-h-screen bg-theme-canvas text-light selection:bg-cyan-500/30 selection:text-cyan-200">
        <Header onOpenProfile={handleOpenProfile} onNavigate={handleNavigate} />
        <main>
          <AnimatePresence mode="wait">
            {currentView === 'home' && (
              <motion.div key="home" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition}>
                <Hero onNavigateToContact={handleNavigateToContact} />
                <MasterPortfolioTimeline />
                <Footer onNavigate={handleNavigate} />
              </motion.div>
            )}
            {currentView === 'contact' && (
              <motion.div key="contact" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition}>
                <ContactPage onNavigateHome={handleNavigateHome} />
              </motion.div>
            )}
            {currentView === 'projects' && (
              <motion.div key="projects" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition}>
                <ProjectSection onNavigateHome={handleNavigateHome} />
              </motion.div>
            )}
            {currentView === 'about' && (
              <motion.div key="about" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition}>
                <AboutSection onNavigateHome={handleNavigateHome} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
        <ProfileModal isOpen={isProfileOpen} onClose={handleCloseProfile} />
      </div>
    </>
  )
}

function App() {
  return (
    <SettingsProvider>
      <AppContent />
    </SettingsProvider>
  )
}

export default App