import React from 'react'
import { motion } from 'framer-motion'
import { FileDown } from 'lucide-react'
import { useSettings } from '../../context/SettingsContext'

const DownloadCV = () => {
  const { socials, profile } = useSettings()

  const resumeHref = socials?.resumeUrl || './home/Vivek_ Resume_2026.pdf'
  const downloadName = `${(profile?.name || 'Vivek_Kumar').replace(/\s+/g, '_')}_Resume.pdf`

  return (
    <motion.a
      href={resumeHref}
      download={downloadName}
      target="_blank"
      rel="noreferrer"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className="inline-flex items-center justify-center gap-3 px-8 py-4 border border-theme bg-theme-card hover:bg-theme-canvas text-theme-base font-bold rounded-2xl transition-all shadow-xl group relative overflow-hidden cursor-pointer"
    >
      <motion.span animate={{ y: [0, 2, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
        <FileDown size={20} className="text-theme-primary group-hover:translate-y-0.5 transition-transform" />
      </motion.span>
      <span>Download CV</span>
      <div className="absolute inset-0 w-full h-full bg-white/5 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500 rounded-2xl pointer-events-none" />
    </motion.a>
  )
}

export default DownloadCV
