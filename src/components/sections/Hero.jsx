import React from 'react'
import DownloadCV from '../ui/DownloadCV'
import { motion } from 'framer-motion'
import { useSettings } from '../../context/SettingsContext'
import Button from '../ui/Button'
import Typography from '../ui/Typography'

const Hero = ({ onNavigateToContact }) => {
  const { profile } = useSettings()
  const heroImageUrl = './home/Viv.png'

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
      <motion.div
        variants={textVariant}
        initial="hidden"
        animate="visible"
        custom={0.1}
        className="mb-2 text-center relative z-10 px-2"
      >
        <Typography variant="lead" className="text-base sm:text-lg md:text-xl font-normal">
          {profile?.tagline || (
            <>
              👋, my name is <span className="text-theme-primary font-bold">{profile?.name || 'Vivek Kumar'}</span> and I am a freelance
            </>
          )}
        </Typography>
      </motion.div>

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
        <Typography variant="body" className="text-zinc-500 font-bold text-sm sm:text-base md:text-lg">
          based in <span className="text-theme-primary font-bold">{profile?.location || 'Mumbai, India'}</span>
        </Typography>
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 opacity-75 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
          <Typography variant="caption">React</Typography>
          <span className="text-zinc-700 hidden sm:inline">•</span>
          <Typography variant="caption">Next.js</Typography>
          <span className="text-zinc-700 hidden sm:inline">•</span>
          <Typography variant="caption">Tailwind</Typography>
          <span className="text-zinc-700 hidden sm:inline">•</span>
          <Typography variant="caption">TypeScript</Typography>
        </div>
      </div>

      <div className="relative z-30 mt-8 sm:mt-auto mb-6 sm:mb-12 flex flex-col sm:flex-row gap-4 w-full sm:w-auto items-center justify-center px-4">
        <Button
          variant="primary"
          size="lg"
          onClick={onNavigateToContact}
          className="w-full sm:w-64 py-4 rounded-xl hover:scale-[1.02] transition-transform shadow-lg cursor-pointer"
        >
          Contact Me
        </Button>
        <div className="w-full sm:w-auto flex justify-center">
          <DownloadCV />
        </div>
      </div>

      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 z-0 w-full max-w-[340px] sm:max-w-[440px] md:max-w-[500px] pointer-events-none px-4 opacity-25 sm:opacity-85 md:opacity-100 transition-opacity duration-500">
        <div className="relative">
          <img
            src={heroImageUrl}
            alt={profile?.name || 'Vivek Kumar'}
            className="w-full h-auto object-cover"
            style={{
              maskImage: 'linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 20%, rgba(0,0,0,1) 85%, rgba(0,0,0,0) 100%)',
              WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 20%, rgba(0,0,0,1) 85%, rgba(0,0,0,0) 100%)',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-theme-canvas via-transparent to-theme-canvas/60 md:hidden" />
        </div>
      </div>
    </section>
  )
}

export default Hero
