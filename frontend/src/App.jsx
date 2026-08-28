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
import PhotosSection from './components/sections/PhotoSection'
import AdminPanel from './components/admin/AdminPanel'
import { SettingsProvider } from './context/SettingsContext'

function AppContent() {
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [currentView, setCurrentView] = useState(() => {
    if (window.location.hash === '#admin') return 'admin'
    return 'home'
  })

  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#admin') {
        setCurrentView('admin')
      } else if (window.location.hash === '#projects') {
        setCurrentView('projects')
      } else if (window.location.hash === '#about') {
        setCurrentView('about')
      } else if (window.location.hash === '#contact') {
        setCurrentView('contact')
      }
    }
    window.addEventListener('hashchange', handleHash)
    return () => window.removeEventListener('hashchange', handleHash)
  }, [])

  const handleOpenProfile = () => setIsProfileOpen(true)
  const handleCloseProfile = () => setIsProfileOpen(false)

  const handleNavigate = (view) => {
    setCurrentView(view)
    if (view === 'home') {
      window.history.replaceState(null, '', ' ')
    } else {
      window.location.hash = `#${view}`
    }
    window.scrollTo(0, 0)
  }

  const handleNavigateHome = () => handleNavigate('home')
  const handleNavigateToContact = () => handleNavigate('contact')

  if (currentView === 'admin') {
    return <AdminPanel onExit={handleNavigateHome} />
  }

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
            {currentView === 'photos' && (
              <motion.div key="photos" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition}>
                <PhotosSection />
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