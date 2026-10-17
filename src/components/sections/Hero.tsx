
import React from 'react'
import DownloadCV from '../ui/DownloadCV'
import { motion, type Variants } from 'framer-motion'
import { useSettings } from '../../context/SettingsContext'
import Button from '../ui/Button'
import Typography from '../ui/Typography'

interface HeroProps {
  onNavigateToContact: () => void
}

const Hero: React.FC<HeroProps> = ({ onNavigateToContact }) => {
  const { profile } = useSettings()
  const heroImageUrl = './home/Viv.png'

  const textVariant: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: (customDelay: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: customDelay,
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      },
    }),
  }

  const roleParts = profile?.role
    ? profile.role.split('&')
    : ['Software', 'Product Engineer']

  const firstRole = roleParts[0]?.trim() || 'Software'
  const secondRole = roleParts[1]
    ? `& ${roleParts[1].trim()}`
    : '& Product Engineer'

  return (
    <section className="relative isolate min-h-screen flex flex-col items-center pt-28 sm:pt-32 md:pt-40 pb-8 sm:pb-12 overflow-hidden px-4 bg-theme-canvas">
      {/* Hero image: background layer */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-0 w-full max-w-[340px] sm:max-w-[440px] md:max-w-[500px] px-4 pointer-events-none transition-opacity duration-500">
        <div className="relative">
          <img
            src={heroImageUrl}
            alt={profile?.name || 'Vivek Kumar'}
            loading="eager"
            decoding="sync"
            className="block w-full h-auto object-cover opacity-25 sm:opacity-85 md:opacity-100"
            style={{
              maskImage:
                'linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 20%, rgba(0,0,0,1) 85%, rgba(0,0,0,0) 100%)',
              WebkitMaskImage:
                'linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 20%, rgba(0,0,0,1) 85%, rgba(0,0,0,0) 100%)',
            }}
          />

          {/* Gradient stays behind the buttons */}
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-theme-canvas via-transparent to-theme-canvas/60 md:hidden" />

          {/* Buttons overlay: mobile only */}
          <div className="absolute bottom-4 sm:bottom-6 left-0 right-0 z-20 flex flex-col sm:flex-row gap-3 w-full px-2 sm:px-0 lg:hidden pointer-events-auto items-center justify-center">
            <Button
              variant="primary"
              size="lg"
              onClick={onNavigateToContact}
              className="w-full sm:w-auto min-h-[48px] px-8 py-3.5 rounded-xl hover:scale-[1.02] transition-transform shadow-lg cursor-pointer text-sm font-bold flex items-center justify-center"
            >
              Contact Me
            </Button>

            <div className="w-full sm:w-auto flex justify-center">
              <DownloadCV />
            </div>
          </div>
        </div>
      </div>

      {/* Tagline */}
      <motion.div
        variants={textVariant}
        initial="hidden"
        animate="visible"
        custom={0.1}
        className="relative z-10 mb-2 px-2 text-center"
      >
        <Typography
          variant="lead"
          className="text-base sm:text-lg md:text-xl font-normal"
        >
          {profile?.tagline || "👋 Hi, I'm Vivek Kumar — Full-Stack & Frontend"}
        </Typography>
      </motion.div>

      {/* Main heading */}
      <div className="relative z-10 text-center leading-tight sm:leading-[0.9] px-2 w-full max-w-5xl mx-auto overflow-hidden">
        <motion.h2
          variants={textVariant}
          initial="hidden"
          animate="visible"
          custom={0.3}
          className="block text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black text-theme-base tracking-tight select-none break-words leading-tight"
        >
          {firstRole}
        </motion.h2>

        <motion.h2
          variants={textVariant}
          initial="hidden"
          animate="visible"
          custom={0.5}
          className="block text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black text-outline tracking-tight select-none break-words leading-tight"
        >
          {secondRole}
        </motion.h2>
      </div>

      {/* Location and technologies */}
      <div className="relative z-10 mt-8 sm:mt-12 w-full max-w-4xl flex flex-col md:flex-row justify-between items-center px-4 sm:px-8 text-center md:text-left gap-4">
        <Typography
          variant="body"
          className="text-zinc-500 font-bold text-sm sm:text-base md:text-lg"
        >
          based in{' '}
          <span className="text-theme-primary font-bold">
            {profile?.location || 'Mumbai, India'}
          </span>
        </Typography>

        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 opacity-75 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
          <Typography variant="caption">React</Typography>
          <span className="hidden sm:inline text-zinc-700">•</span>
          <Typography variant="caption">Next.js</Typography>
          <span className="hidden sm:inline text-zinc-700">•</span>
          <Typography variant="caption">Tailwind</Typography>
          <span className="hidden sm:inline text-zinc-700">•</span>
          <Typography variant="caption">TypeScript</Typography>
        </div>
      </div>

      {/* Original buttons: tablet and desktop only */}
      <div className="relative z-20 mt-8 sm:mt-auto mb-6 sm:mb-12 hidden lg:flex flex-col sm:flex-row gap-4 w-full sm:w-auto items-center justify-center px-4">
        <Button
          variant="primary"
          size="lg"
          onClick={onNavigateToContact}
          className="w-full sm:w-64 min-h-[48px] py-3.5 sm:py-4 rounded-xl hover:scale-[1.02] transition-transform shadow-lg cursor-pointer text-sm font-bold flex items-center justify-center"
        >
          Contact Me
        </Button>

        <div className="w-full sm:w-auto flex justify-center">
          <DownloadCV />
        </div>
      </div>
    </section>
  )
}

export default Hero
