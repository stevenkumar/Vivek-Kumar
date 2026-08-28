import React from 'react'
import DownloadCV from '../ui/DownloadCV'
import { motion } from 'framer-motion'
import useMedia from '../../hooks/useMedia'
import { useSettings } from '../../context/SettingsContext'

const Hero = ({ onNavigateToContact }) => {
  const { profile } = useSettings()
  const { url: heroImageUrl } = useMedia('hero', './home/Viv.png')

  const textVariant = {
    hidden: { opacity: 0, y: 50 },
    visible: (customDelay) => ({
      opacity: 1,
      y: 0,
      transition: { delay: customDelay, duration: 0.8, ease: [0.22, 1, 0.36, 1] },
    }),
  }

  const roleParts = profile?.role ? profile.role.split('&') : ['Webdesigner', 'Programmer']
  const firstRole = roleParts[0]?.trim() || 'Webdesigner'
  const secondRole = roleParts[1] ? `& ${roleParts[1].trim()}` : '& Programmer'

  return (
    <section className="relative min-h-screen flex flex-col items-center pt-28 sm:pt-32 md:pt-40 pb-16 overflow-hidden px-4 bg-theme-canvas">
      <motion.p
        variants={textVariant}
        initial="hidden"
        animate="visible"
        custom={0.1}
        className="text-theme-muted text-base sm:text-lg md:text-xl mb-2 text-center relative z-10 font-normal px-2"
      >
        {profile?.tagline || (
          <>
            👋, my name is <span className="text-theme-primary font-bold">{profile?.name || 'Vivek Kumar'}</span> and I am a freelance
          </>
        )}
      </motion.p>

      <div className="relative z-10 text-center leading-[0.9] sm:leading-[0.85]">
        <motion.h2
          variants={textVariant}
          initial="hidden"
          animate="visible"
          custom={0.3}
          className="text-[12vw] sm:text-[11vw] md:text-[10rem] lg:text-[11rem] font-black text-theme-base block tracking-tight select-none"
        >
          {firstRole}
        </motion.h2>
        <motion.h2
          variants={textVariant}
          initial="hidden"
          animate="visible"
          custom={0.5}
          className="text-[12vw] sm:text-[11vw] md:text-[10rem] lg:text-[11rem] font-black text-outline block tracking-tight select-none"
        >
          {secondRole}
        </motion.h2>
      </div>

      <div className="relative z-20 mt-8 sm:mt-12 w-full max-w-4xl flex flex-col md:flex-row justify-between items-center px-4 sm:px-8 text-center md:text-left gap-4">
        <p className="text-zinc-500 font-bold text-sm sm:text-base md:text-lg">
          based in <span className="text-theme-primary font-bold">{profile?.location || 'Mumbai, India'}</span>
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 opacity-75 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
          <span className="text-theme-muted font-bold tracking-wide text-xs sm:text-sm font-mono">React</span>
          <span className="text-zinc-700 hidden sm:inline">•</span>
          <span className="text-theme-muted font-bold tracking-wide text-xs sm:text-sm font-mono">Next.js</span>
          <span className="text-zinc-700 hidden sm:inline">•</span>
          <span className="text-theme-muted font-bold tracking-wide text-xs sm:text-sm font-mono">Tailwind</span>
          <span className="text-zinc-700 hidden sm:inline">•</span>
          <span className="text-theme-muted font-bold tracking-wide text-xs sm:text-sm font-mono">TypeScript</span>
        </div>
      </div>

      <div className="relative z-30 mt-8 sm:mt-auto mb-6 sm:mb-12 flex flex-col sm:flex-row gap-4 w-full sm:w-auto items-center justify-center px-4">
        <button
          onClick={onNavigateToContact}
          className="gradient-primary text-white font-bold px-8 py-4 rounded-xl transition duration-300 w-full sm:w-64 shadow-xl cursor-pointer text-center hover:opacity-95 hover:scale-[1.02]"
        >
          Contact Me
        </button>
        <div className="w-full sm:w-auto flex justify-center">
          <DownloadCV />
        </div>
      </div>

      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 z-10 w-full max-w-[420px] sm:max-w-[500px] pointer-events-none px-4">
        <img
          src={heroImageUrl}
          alt={profile?.name || 'Vivek Kumar'}
          className="w-full h-auto object-cover mask-image-gradient"
        />
      </div>
    </section>
  )
}

export default Hero
