import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Github, Twitter, Linkedin, Copy, Check, ArrowUpRight, Lock } from 'lucide-react'
import { useSettings } from '../../context/SettingsContext'

const Footer = ({ onNavigate }) => {
  const { profile, socials } = useSettings()
  const [time, setTime] = useState('')
  const [copied, setCopied] = useState(false)

  const directEmail = socials?.email || 'vkvseri@gmail.com'

  useEffect(() => {
    const updateClock = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }))
    }
    updateClock()
    const interval = setInterval(updateClock, 1000)
    return () => clearInterval(interval)
  }, [])

  const handleCopy = () => {
    navigator.clipboard.writeText(directEmail)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleContactClick = (e) => {
    e.preventDefault()
    if (onNavigate) onNavigate('contact')
    else window.location.hash = '#contact'
  }

  return (
    <footer className="w-full p-10 px-6 bg-transparent font-sans">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="relative grid grid-cols-1 md:grid-cols-3 items-center gap-6 p-4 sm:p-5 rounded-[2.5rem] border border-theme bg-theme-card backdrop-blur-2xl shadow-2xl"
        >
          <div className="flex items-center gap-4 pl-4">
            <div className="relative h-2 w-2">
              <span className="animate-ping absolute inset-0 rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative block h-2 w-2 rounded-full bg-emerald-500"></span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-tighter text-theme-muted font-bold font-mono">Status</span>
              <span className="text-sm text-theme-base font-medium">
                {profile?.openToWork ? 'Available for hire' : 'Engaged on projects'}
              </span>
            </div>
          </div>

          <div className="flex justify-self-center items-center bg-theme-canvas border border-theme p-1.5 rounded-full">
            {[
              { icon: <Github size={18} />, href: socials?.github || 'https://github.com/stevenkumar' },
              { icon: <Twitter size={18} />, href: socials?.twitter || 'https://x.com/Vivek9653' },
              { icon: <Linkedin size={18} />, href: socials?.linkedin || 'https://www.linkedin.com/in/vivek-kumar-733552317/' },
            ].map((social, i) => (
              <motion.a
                key={i}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                whileHover={{ y: -3, scale: 1.1 }}
                className="p-3 rounded-full text-theme-muted hover:text-theme-primary transition-all cursor-pointer"
              >
                {social.icon}
              </motion.a>
            ))}
            <div className="w-px h-4 bg-theme-muted/30 mx-2" />
            <motion.button
              onClick={handleCopy}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-theme-muted hover:text-theme-base cursor-pointer"
            >
              <AnimatePresence mode="wait">
                {copied ? (
                  <motion.span key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                    <Check size={16} className="text-emerald-400" />
                  </motion.span>
                ) : (
                  <motion.span key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                    <Copy size={16} />
                  </motion.span>
                )}
              </AnimatePresence>
              {copied ? 'Copied!' : 'Email'}
            </motion.button>
          </div>

          <div className="justify-self-center md:justify-self-end pr-2">
            <motion.a
              href="#contact"
              onClick={handleContactClick}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group flex items-center gap-3 gradient-primary text-white pl-6 pr-3 py-3 rounded-full text-sm font-bold transition-all shadow-lg cursor-pointer"
            >
              START A PROJECT
              <div className="bg-white/20 rounded-full p-1.5 group-hover:rotate-45 transition-transform">
                <ArrowUpRight size={18} />
              </div>
            </motion.a>
          </div>
        </motion.div>

        <div className="mt-8 flex flex-col md:flex-row justify-between items-center px-8 gap-4">
          <div className="flex items-center gap-6 text-[11px] font-bold text-theme-muted uppercase tracking-[0.15em]">
            <p>© {new Date().getFullYear()}</p>
            <p>Made By {profile?.name || 'Vivek Kumar'}</p>
            <a
              href="#admin"
              onClick={(e) => {
                e.preventDefault()
                if (onNavigate) onNavigate('admin')
                else window.location.hash = '#admin'
              }}
              className="inline-flex items-center gap-1 text-theme-muted hover:text-theme-primary transition-colors lowercase font-mono text-[10px]"
              title="Admin Customization Panel"
            >
              <Lock size={11} />
              <span>admin</span>
            </a>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
              <span className="text-[9px] uppercase text-zinc-600 font-black leading-none">Local Time</span>
              <span className="text-sm font-mono text-zinc-400">{time}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
