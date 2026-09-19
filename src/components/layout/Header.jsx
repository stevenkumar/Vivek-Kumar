import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSettings } from '../../context/SettingsContext'
import Button from '../ui/Button'
import Typography from '../ui/Typography'

const Header = ({ onNavigate }) => {
  const { profile } = useSettings()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navLinks = [
    { name: 'Projects', view: 'projects' },
    { name: 'About', view: 'about' },
  ]

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)

  const handleNavLinkClick = (view) => {
    onNavigate(view)
    setIsMobileMenuOpen(false)
  }

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  return (
    <header className="fixed top-0 left-0 right-0 z-[9995] py-5 px-6 md:px-12 flex justify-between items-center bg-theme-canvas/90 backdrop-blur-md border-b border-theme">
      <div
        className="group cursor-pointer flex items-end"
        onClick={() => onNavigate('home')}
        title="Go to Home"
      >
        <Typography
          variant="h3"
          as="h1"
          className="text-2xl sm:text-3xl font-black tracking-tighter text-theme-base group-hover:text-theme-primary transition-colors"
        >
          {profile?.name || 'Vivek Kumar'}
        </Typography>
      </div>

      <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-theme-muted">
        {navLinks.map((link) => (
          <button
            key={link.name}
            type="button"
            onClick={() => onNavigate(link.view)}
            className="hover:text-theme-primary transition-colors cursor-pointer bg-transparent border-0 font-medium text-sm text-theme-muted"
          >
            {link.name}
          </button>
        ))}
        <div className="flex space-x-2 border-l border-theme pl-8 font-mono text-xs">
          <span className="text-zinc-500 cursor-pointer hover:text-white">HN</span>
          <span className="text-theme-base font-bold border-b-2 border-theme-primary">EN</span>
        </div>
      </nav>

      <div className="hidden md:block">
        <Button
          variant="primary"
          size="md"
          onClick={() => onNavigate('contact')}
          className="px-6 py-2.5 text-xs sm:text-sm"
        >
          Contact Me
        </Button>
      </div>

      <button
        type="button"
        className="md:hidden z-[9996] relative p-2 w-10 h-10 flex flex-col justify-center items-center gap-1.5 focus:outline-none cursor-pointer bg-transparent border-0"
        onClick={toggleMenu}
        aria-label="Toggle Navigation Menu"
      >
        <motion.span
          animate={isMobileMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-8 h-0.5 bg-white block rounded-full"
        />
        <motion.span
          animate={isMobileMenuOpen ? { opacity: 0, x: -10 } : { opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
          className="w-8 h-0.5 bg-white block rounded-full"
        />
        <motion.span
          animate={isMobileMenuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-8 h-0.5 bg-white block rounded-full"
        />
      </button>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleMenu}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9990] md:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-theme-canvas/95 backdrop-blur-2xl z-[9991] border-l border-theme flex flex-col p-10 sm:p-12 md:hidden"
            >
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } } }}
                className="flex flex-col space-y-8 mt-16"
              >
                <Typography variant="caption" className="text-zinc-500 font-bold mb-2">
                  Navigation
                </Typography>
                {navLinks.map((link) => (
                  <motion.button
                    key={link.name}
                    type="button"
                    onClick={() => handleNavLinkClick(link.view)}
                    variants={{ hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0 } }}
                    className="text-3xl sm:text-4xl font-black hover:text-theme-primary transition uppercase tracking-tighter text-left cursor-pointer bg-transparent border-0 text-theme-base"
                  >
                    {link.name}
                  </motion.button>
                ))}
                <motion.div
                  variants={{ hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0 } }}
                  className="pt-8 border-t border-theme"
                >
                  <Typography variant="caption" className="text-zinc-500 font-bold mb-4 block">
                    Language
                  </Typography>
                  <div className="flex space-x-6 font-mono">
                    <span className="text-zinc-500 text-lg">HN</span>
                    <span className="text-theme-base text-lg font-bold border-b-2 border-theme-primary">
                      EN
                    </span>
                  </div>
                </motion.div>
                <motion.div variants={{ hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0 } }}>
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => handleNavLinkClick('contact')}
                    className="w-full mt-auto py-4 rounded-2xl text-lg font-black"
                  >
                    LET'S TALK
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Header
