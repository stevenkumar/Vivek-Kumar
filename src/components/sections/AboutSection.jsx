import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Github,
  Linkedin,
  Twitter,
  Mail,
  MapPin,
  Briefcase,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Compass,
  Sparkles,
  Rocket,
  Layers,
} from 'lucide-react'
import { useSettings } from '../../context/SettingsContext'
import Button from '../ui/Button'
import Typography from '../ui/Typography'

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
    <Typography variant="h3" className="text-2xl font-black">{value}</Typography>
    <Typography variant="caption" className="text-xs text-theme-muted mt-0.5 text-center font-medium lowercase tracking-normal">{label}</Typography>
  </div>
)

const parseStorySections = (rawText) => {
  if (!rawText) return []
  const cleaned = rawText.replace(/<br\s*\/?>|<\/br>/gi, '\n')
  const blocks = cleaned.split(/\n?\s*---\s*\n?/).map((b) => b.trim()).filter(Boolean)

  const milestoneIcons = [Compass, Briefcase, Sparkles, Rocket, Layers]

  return blocks.map((block, idx) => {
    const lines = block.split('\n').map((l) => l.trim()).filter(Boolean)
    let title = ''
    let subtitle = ''
    let represents = ''
    const paragraphs = []

    lines.forEach((line) => {
      if (line.startsWith('### ')) {
        title = line.replace('### ', '').trim()
      } else if (line.startsWith('**') && line.endsWith('**') && !line.toLowerCase().includes('what it represents')) {
        subtitle = line.slice(2, -2).trim()
      } else if (line.toLowerCase().includes('what it represents')) {
        represents = line
          .replace(/\*\*What it represents:\*\*/i, '')
          .replace(/What it represents:/i, '')
          .trim()
      } else {
        paragraphs.push(line)
      }
    })

    return {
      title: title || `Chapter ${idx + 1}`,
      subtitle,
      paragraphs,
      represents,
      icon: milestoneIcons[idx % milestoneIcons.length],
    }
  })
}

const renderFormattedText = (text) => {
  if (!text) return ''
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g)
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={index} className="text-theme-base font-bold">
          {part.slice(2, -2)}
        </strong>
      )
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return (
        <em key={index} className="text-theme-primary not-italic font-medium">
          {part.slice(1, -1)}
        </em>
      )
    }
    return part
  })
}

const MilestoneItem = ({ item }) => {
  const IconComponent = item.icon
  return (
    <div className="relative pl-7 sm:pl-9 border-l-2 border-theme-primary/30 space-y-3 pb-8 last:pb-2">
      <div className="absolute -left-[17px] top-0.5 h-8 w-8 rounded-full bg-theme-card border-2 border-theme-primary flex items-center justify-center shadow-lg text-theme-primary">
        <IconComponent size={15} />
      </div>

      <div className="flex flex-wrap items-center gap-3 pt-0.5">
        <h4 className="text-xl sm:text-2xl font-black text-theme-base tracking-tight">
          {item.title}
        </h4>
        {item.subtitle && (
          <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-theme-primary/10 border border-theme-primary/30 text-theme-primary font-mono">
            {item.subtitle}
          </span>
        )}
      </div>

      <div className="space-y-3 text-theme-muted text-sm sm:text-base leading-relaxed">
        {item.paragraphs.map((para, pIdx) => (
          <p key={pIdx}>{renderFormattedText(para)}</p>
        ))}
      </div>

      {item.represents && (
        <div className="mt-4 p-4 rounded-xl bg-theme-canvas/80 border border-theme flex flex-col sm:flex-row sm:items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-theme-primary shrink-0">
            What it represents:
          </span>
          <span className="text-sm text-theme-base font-medium">
            {item.represents}
          </span>
        </div>
      )}
    </div>
  )
}

const AboutSection = ({ onNavigateHome }) => {
  const { profile, socials } = useSettings()
  const profileImageUrl = '/home/Vivekimg.jpg'
  const [storyExpanded, setStoryExpanded] = useState(false)

  const bioText =
    profile?.bio ||
    "Hi, I'm Vivek Kumar — a Frontend Developer who is passionate about building web experiences that don't just work, but feel right."
  const storyText = profile?.story || ''
  const milestones = parseStorySections(storyText)

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  }, [])

  return (
    <section className="min-h-screen bg-theme-canvas text-theme-base py-24 px-4">
      <div className="max-w-5xl mx-auto">
        {onNavigateHome && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onNavigateHome}
            className="mb-8 inline-flex items-center gap-2 text-theme-muted hover:text-theme-base transition-colors group cursor-pointer h-auto px-0 py-0"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1.5 transition-transform" />
            <span className="font-semibold text-sm">Back to Home</span>
          </Button>
        )}

        <Typography
          variant="caption"
          className="text-theme-primary text-sm font-bold tracking-widest uppercase mb-3 text-center block"
        >
          — Who I Am —
        </Typography>
        <Typography
          variant="h2"
          className="text-4xl md:text-5xl font-black text-center mb-14 gradient-primary-text"
        >
          About Me
        </Typography>

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
            <Typography variant="h3" as="h1" className="text-2xl font-black mb-1">{profile?.name || 'Vivek Kumar'}</Typography>
            <Typography variant="body" className="text-theme-primary text-sm font-semibold mb-1">{profile?.role || 'Frontend Developer'}</Typography>
            <div className="flex items-center gap-1.5 text-theme-muted text-xs mb-2 font-mono">
              <MapPin size={12} /> {profile?.location || 'Mumbai, India'}
            </div>
            <div className="flex items-center gap-1.5 text-theme-muted text-xs mb-6 font-mono">
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
              <StatCard value={profile?.completedProjects || '3+'} label="Projects" />
              <StatCard value={profile?.happyClients || '10+'} label="Clients" />
            </div>
          </motion.div>

          {/* Short Bio */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="lg:col-span-2 bg-theme-card border border-theme rounded-[22px] p-8 md:p-10 shadow-2xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-8 w-1 gradient-primary rounded-full" />
                <div>
                  <Typography variant="h3" className="text-xl font-bold">Who I Am</Typography>
                  <Typography variant="caption" className="text-xs text-theme-primary lowercase tracking-normal font-mono block">
                    Engineering intuitive, human-centric web experiences
                  </Typography>
                </div>
              </div>

              {/* Highlight Quote Callout */}
              <div className="mb-6 p-4 rounded-xl bg-theme-canvas/70 border border-theme border-l-4 border-l-theme-primary">
                <p className="text-sm sm:text-base font-medium text-theme-base italic leading-relaxed">
                  "Frontend development isn't just about writing code — it's about shaping how people interact with a product."
                </p>
              </div>

              <div className="space-y-4 text-theme-muted text-sm sm:text-base leading-relaxed">
                {bioText.split('\n\n').map((para, i) => (
                  <p key={i}>{renderFormattedText(para)}</p>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-theme">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-theme-muted">
                  Core Toolkit &amp; Technologies
                </span>
                <span className="text-[11px] font-mono text-zinc-500">Always learning</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  { name: 'React 19', highlight: true },
                  { name: 'Next.js', highlight: true },
                  { name: 'JavaScript (ES6+)', highlight: false },
                  { name: 'TypeScript', highlight: false },
                  { name: 'Tailwind CSS', highlight: true },
                  { name: 'Framer Motion', highlight: false },
                  { name: 'Node.js', highlight: false },
                  { name: 'Vite', highlight: false },
                  { name: 'Git & GitHub', highlight: false },
                ].map((tech) => (
                  <span
                    key={tech.name}
                    className={`text-xs px-3 py-1.5 rounded-xl border transition-all font-mono font-medium ${
                      tech.highlight
                        ? 'bg-theme-primary/10 border-theme-primary/30 text-theme-primary hover:border-theme-primary'
                        : 'bg-theme-canvas border-theme text-theme-muted hover:text-theme-base hover:border-theme-primary/50'
                    }`}
                  >
                    {tech.name}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Story Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="bg-theme-card border border-theme rounded-[22px] p-8 md:p-10 shadow-2xl"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="h-8 w-1 gradient-primary rounded-full" />
            <Typography variant="h3" className="text-xl font-bold">My Story</Typography>
          </div>

          <div className="space-y-2">
            {milestones.length > 0 ? (
              <>
                {/* First Milestone (Always Visible) */}
                <MilestoneItem item={milestones[0]} />

                {/* Remaining Milestones (Expandable) */}
                <AnimatePresence>
                  {storyExpanded && milestones.slice(1).map((item, index) => (
                    <motion.div
                      key={item.title || index}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.5, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <MilestoneItem item={item} />
                    </motion.div>
                  ))}
                </AnimatePresence>

                {milestones.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setStoryExpanded(!storyExpanded)}
                    className="mt-6 flex items-center gap-2 text-theme-primary hover:opacity-80 text-sm font-semibold h-auto px-0 py-0 hover:bg-transparent cursor-pointer"
                  >
                    {storyExpanded ? (
                      <>
                        <ChevronUp size={16} className="group-hover:-translate-y-0.5 transition-transform" /> Read Less
                      </>
                    ) : (
                      <>
                        <ChevronDown size={16} className="group-hover:translate-y-0.5 transition-transform" /> Read Full Journey (Tekunik & TekDoctor)
                      </>
                    )}
                  </Button>
                )}
              </>
            ) : (
              <p className="text-theme-muted text-sm sm:text-base leading-relaxed">{storyText}</p>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default AboutSection
