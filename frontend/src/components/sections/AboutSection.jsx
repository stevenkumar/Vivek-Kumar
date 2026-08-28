import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Github, Linkedin, Twitter, Mail, MapPin, Briefcase, ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react'
import useMedia from '../../hooks/useMedia'
import { useSettings } from '../../context/SettingsContext'

const SocialIcon = ({ icon, link, label }) => (
  <a
    href={link}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className="p-2.5 bg-theme-card rounded-full text-theme-muted hover:bg-theme-primary hover:text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border border-theme"
  >
    {icon}
  </a>
)

const StatCard = ({ value, label }) => (
  <div className="flex flex-col items-center px-4 py-3 bg-theme-canvas/60 rounded-2xl border border-theme">
    <span className="text-2xl font-black text-theme-base">{value}</span>
    <span className="text-xs text-theme-muted mt-0.5 text-center font-medium">{label}</span>
  </div>
)

const AboutSection = ({ onNavigateHome }) => {
  const { profile, socials } = useSettings()
  const { url: profileImageUrl } = useMedia('profile', './home/Vivekimg.jpg')
  const [storyExpanded, setStoryExpanded] = useState(false)

  const bioText =
    profile?.bio ||
    "Hi, I'm Vivek Kumar — a Frontend Developer who is passionate about building web experiences that don't just work, but feel right."
  const storyText = profile?.story || 'A village soul with a high-speed city processor.'

  return (
    <section className="min-h-screen bg-theme-canvas text-theme-base py-24 px-4">
      <div className="max-w-5xl mx-auto">
        {onNavigateHome && (
          <motion.button
            onClick={onNavigateHome}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 inline-flex items-center gap-2 text-theme-muted hover:text-theme-base transition-colors group cursor-pointer"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1.5 transition-transform" />
            <span className="font-semibold text-sm">Back to Home</span>
          </motion.button>
        )}

        <motion.p
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-theme-primary text-sm font-bold tracking-widest uppercase mb-3 text-center"
        >
          — Who I Am —
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-black text-center mb-14 gradient-primary-text"
        >
          About Me
        </motion.h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="lg:col-span-1 bg-theme-card border border-theme rounded-[22px] p-8 flex flex-col items-center text-center shadow-2xl"
          >
            <div className="relative mb-5">
              <div className="absolute -inset-1.5 gradient-primary rounded-full blur-md opacity-70" />
              <img
                src={profileImageUrl}
                alt={profile?.name || 'Vivek Kumar'}
                className="relative w-28 h-28 rounded-full border-4 border-theme-canvas object-cover"
              />
              {profile?.openToWork && (
                <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-theme-canvas shadow-md shadow-emerald-400/50" />
              )}
            </div>
            <h1 className="text-2xl font-black text-theme-base mb-1">{profile?.name || 'Vivek Kumar'}</h1>
            <p className="text-theme-primary text-sm font-semibold mb-1">{profile?.role || 'Frontend Developer'}</p>
            <div className="flex items-center gap-1.5 text-theme-muted text-xs mb-2">
              <MapPin size={12} /> {profile?.location || 'Mumbai, India'}
            </div>
            <div className="flex items-center gap-1.5 text-theme-muted text-xs mb-6">
              <Briefcase size={12} />
              <span className={profile?.openToWork ? 'text-emerald-400 font-semibold' : 'text-zinc-500'}>
                {profile?.openToWork ? 'Open to Work' : 'Currently Engaged'}
              </span>
            </div>
            <div className="flex gap-3 mb-8">
              {socials?.github && <SocialIcon icon={<Github size={18} />} link={socials.github} label="GitHub" />}
              {socials?.linkedin && <SocialIcon icon={<Linkedin size={18} />} link={socials.linkedin} label="LinkedIn" />}
              {socials?.twitter && <SocialIcon icon={<Twitter size={18} />} link={socials.twitter} label="Twitter" />}
              {socials?.email && <SocialIcon icon={<Mail size={18} />} link={`mailto:${socials.email}`} label="Email" />}
            </div>
            <div className="grid grid-cols-3 gap-2 w-full">
              <StatCard value={profile?.experienceYears || '2+'} label="Yrs Exp" />
              <StatCard value={profile?.completedProjects || '15+'} label="Projects" />
              <StatCard value={profile?.happyClients || '10+'} label="Clients" />
            </div>
          </motion.div>

          {/* Short Bio */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="lg:col-span-2 bg-theme-card border border-theme rounded-[22px] p-8 shadow-2xl flex flex-col justify-between"
          >
            <div>
              <h3 className="text-xs uppercase tracking-widest text-theme-primary font-bold mb-4">Who I Am</h3>
              <div className="space-y-4 text-theme-muted text-sm leading-relaxed">
                {bioText.split('\n\n').map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-6">
              {['React', 'Next.js', 'Node.js', 'Tailwind CSS', 'Framer Motion', 'TypeScript', 'Vite'].map((tech) => (
                <span
                  key={tech}
                  className="text-xs bg-theme-canvas text-theme-primary px-3 py-1 rounded-full border border-theme font-medium font-mono"
                >
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Story Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          viewport={{ once: true }}
          className="bg-theme-card border border-theme rounded-[22px] p-8 shadow-2xl"
        >
          <div className="flex items-start gap-4 mb-6">
            <div className="text-6xl text-theme-primary opacity-30 font-serif leading-none -mt-2 select-none">"</div>
            <div>
              <h3 className="text-xs uppercase tracking-widest text-theme-primary font-bold mb-1">My Story</h3>
              <p className="text-xl font-bold text-theme-base leading-snug">A village soul with a high-speed city processor.</p>
            </div>
          </div>
          <div className="text-theme-muted text-sm leading-relaxed space-y-4">
            {storyText
              .split('\n\n')
              .slice(0, 2)
              .map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            <AnimatePresence>
              {storyExpanded && (
                <motion.div
                  key="story-rest"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                  className="overflow-hidden space-y-4"
                >
                  {storyText
                    .split('\n\n')
                    .slice(2)
                    .map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button
            onClick={() => setStoryExpanded(!storyExpanded)}
            className="mt-6 flex items-center gap-2 text-theme-primary hover:opacity-80 text-sm font-semibold transition-colors group cursor-pointer"
          >
            {storyExpanded ? (
              <>
                <ChevronUp size={16} className="group-hover:-translate-y-0.5 transition-transform" /> Read Less
              </>
            ) : (
              <>
                <ChevronDown size={16} className="group-hover:translate-y-0.5 transition-transform" /> Read My Full Story
              </>
            )}
          </button>
        </motion.div>
      </div>
    </section>
  )
}

export default AboutSection
