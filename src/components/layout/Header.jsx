import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home,
  Briefcase,
  User,
  Mail,
  X,
  ChevronRight,
  Github,
  Linkedin,
  Twitter,
  ArrowUpRight,
} from 'lucide-react'
import { useSettings } from '../../context/SettingsContext'
import Button from '../ui/Button'
import Typography from '../ui/Typography'

const Header = ({ onNavigate }) => {
  const { profile, socials } = useSettings()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [currentHash, setCurrentHash] = useState(() =>
    typeof window !== 'undefined' ? window.location.hash.replace('#', '') || 'home' : 'home'
  )

  const navLinks = [
    { name: 'Home', view: 'home', icon: Home, desc: 'Main overview & hero' },
    { name: 'Projects', view: 'projects', icon: Briefcase, desc: 'Selected works & apps' },
    { name: 'About', view: 'about', icon: User, desc: 'My journey & tech stack' },
    { name: 'Contact', view: 'contact', icon: Mail, desc: 'Get in touch & direct inbox' },
  ]

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)

  const handleNavLinkClick = (view) => {
    onNavigate(view)
    setCurrentHash(view)
    setIsMobileMenuOpen(false)
  }

  useEffect(() => {
    const updateHash = () => {
      setCurrentHash(window.location.hash.replace('#', '') || 'home')
    }
    window.addEventListener('hashchange', updateHash)
    return () => window.removeEventListener('hashchange', updateHash)
  }, [])

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[9995] py-4 sm:py-5 px-5 sm:px-8 md:px-12 flex justify-between items-center bg-theme-canvas/90 backdrop-blur-md border-b border-theme">
        <div
          className="group cursor-pointer flex items-center gap-2"
          onClick={() => handleNavLinkClick('home')}
          title="Go to Home"
        >
          <div className="h-8 w-8 rounded-lg bg-theme-primary/10 border border-theme flex items-center justify-center font-black text-xs text-theme-primary font-mono group-hover:scale-105 transition-transform">
            VK
          </div>
          <Typography
            variant="h3"
            as="h1"
            className="text-xl sm:text-2xl md:text-3xl font-black tracking-tighter text-theme-base group-hover:text-theme-primary transition-colors"
          >
            {profile?.name || 'Vivek Kumar'}
          </Typography>
        </div>

        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-theme-muted">
          {navLinks
            .filter((l) => l.view !== 'home')
            .map((link) => (
              <button
                key={link.name}
                type="button"
                onClick={() => onNavigate(link.view)}
                className={`hover:text-theme-primary transition-colors cursor-pointer bg-transparent border-0 font-medium text-sm ${
                  currentHash === link.view ? 'text-theme-primary font-bold' : 'text-theme-muted'
                }`}
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

        {/* Mobile Hamburger Trigger Button */}
        <button
          type="button"
          className="md:hidden z-[9996] relative p-2 w-10 h-10 flex flex-col justify-center items-center gap-1.5 focus:outline-none cursor-pointer bg-transparent border-0 rounded-lg hover:bg-theme-card/60 transition-colors"
          onClick={toggleMenu}
          aria-label={isMobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
        >
          <motion.span
            animate={isMobileMenuOpen ? { rotate: 45, y: 7.5 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.25 }}
            className="w-6 h-0.5 bg-white block rounded-full"
          />
          <motion.span
            animate={isMobileMenuOpen ? { opacity: 0, scale: 0 } : { opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="w-6 h-0.5 bg-white block rounded-full"
          />
          <motion.span
            animate={isMobileMenuOpen ? { rotate: -45, y: -7.5 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.25 }}
            className="w-6 h-0.5 bg-white block rounded-full"
          />
        </button>
      </header>

      {/* Mobile Drawer (placed outside header to avoid stacking/containment bugs) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-[9998] md:hidden">
            {/* Backdrop Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={toggleMenu}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Sidebar Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              className="absolute top-0 right-0 bottom-0 w-[88%] max-w-sm bg-theme-card/98 backdrop-blur-2xl border-l border-theme flex flex-col shadow-2xl overflow-hidden"
            >
              {/* Drawer Top Bar */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-theme bg-theme-canvas/50">
                <div className="flex items-center gap-2.5">
                  <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-mono font-semibold text-theme-base">
                    {profile?.name || 'Vivek Kumar'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={toggleMenu}
                  className="p-2 rounded-xl bg-theme-card border border-theme text-theme-muted hover:text-theme-base hover:border-theme-primary transition-colors cursor-pointer"
                  aria-label="Close menu"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Scrollable Navigation Body */}
              <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-6 space-y-6">
                <div>
                  <Typography variant="caption" className="text-zinc-500 font-bold mb-3 block text-[11px] uppercase tracking-wider">
                    Menu Navigation
                  </Typography>
                  <div className="space-y-2">
                    {navLinks.map((link) => {
                      const Icon = link.icon
                      const isActive = currentHash === link.view
                      return (
                        <button
                          key={link.name}
                          type="button"
                          onClick={() => handleNavLinkClick(link.view)}
                          className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer text-left group ${
                            isActive
                              ? 'bg-theme-primary/10 border-theme-primary text-theme-base'
                              : 'bg-theme-canvas/40 border-theme text-theme-muted hover:border-theme-primary/40 hover:bg-theme-canvas hover:text-theme-base'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`p-2 rounded-lg border transition-colors ${
                                isActive
                                  ? 'bg-theme-primary text-white border-theme-primary'
                                  : 'bg-theme-card text-theme-muted border-theme group-hover:text-theme-primary'
                              }`}
                            >
                              <Icon size={16} />
                            </div>
                            <div>
                              <div className="font-bold text-sm text-theme-base group-hover:text-theme-primary transition-colors">
                                {link.name}
                              </div>
                              <div className="text-[11px] text-zinc-500 line-clamp-1">
                                {link.desc}
                              </div>
                            </div>
                          </div>
                          <ChevronRight
                            size={16}
                            className={`transition-transform group-hover:translate-x-1 ${
                              isActive ? 'text-theme-primary' : 'text-zinc-600'
                            }`}
                          />
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Direct CTA */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-theme-canvas to-theme-card border border-theme space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      Open For Hire
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">Mumbai, IST</span>
                  </div>
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => handleNavLinkClick('contact')}
                    className="w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg"
                  >
                    <span>Start a Project</span>
                    <ArrowUpRight size={16} />
                  </Button>
                </div>
              </div>

              {/* Drawer Bottom Bar: Social Links & Language */}
              <div className="p-5 border-t border-theme bg-theme-canvas/70 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {socials?.github && (
                    <a
                      href={socials.github}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-lg bg-theme-card border border-theme text-theme-muted hover:text-theme-primary hover:border-theme-primary transition-colors"
                      title="GitHub"
                    >
                      <Github size={16} />
                    </a>
                  )}
                  {socials?.linkedin && (
                    <a
                      href={socials.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-lg bg-theme-card border border-theme text-theme-muted hover:text-theme-primary hover:border-theme-primary transition-colors"
                      title="LinkedIn"
                    >
                      <Linkedin size={16} />
                    </a>
                  )}
                  {socials?.twitter && (
                    <a
                      href={socials.twitter}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-lg bg-theme-card border border-theme text-theme-muted hover:text-theme-primary hover:border-theme-primary transition-colors"
                      title="Twitter"
                    >
                      <Twitter size={16} />
                    </a>
                  )}
                  <a
                    href={`mailto:${socials?.email || 'vkvseri@gmail.com'}`}
                    className="p-2 rounded-lg bg-theme-card border border-theme text-theme-muted hover:text-theme-primary hover:border-theme-primary transition-colors"
                    title="Direct Email"
                  >
                    <Mail size={16} />
                  </a>
                </div>

                <div className="flex items-center space-x-2 font-mono text-xs">
                  <span className="text-zinc-500">HN</span>
                  <span className="text-zinc-600">/</span>
                  <span className="text-theme-base font-bold border-b border-theme-primary">EN</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Header
