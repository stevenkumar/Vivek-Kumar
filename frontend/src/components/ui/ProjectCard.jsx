import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Github, ExternalLink, Sparkles, Code2 } from 'lucide-react'

const ProjectCard = ({ project, index = 0 }) => {
  const [imageError, setImageError] = useState(false)

  const {
    title,
    description,
    tags = [],
    repoLink,
    liveLink,
    link,
    imageUrl,
    category,
    featured,
  } = project

  const projectUrl = link || liveLink
  const watermarkNumber = String(index + 1).padStart(2, '0')

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: (index % 3) * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="bg-theme-card rounded-[22px] p-6 sm:p-8 md:p-12 overflow-hidden relative border border-theme hover:border-theme-primary transition-all duration-500 shadow-2xl group"
    >
      {/* Background Watermark */}
      <div className="absolute -right-6 -bottom-10 opacity-[0.03] rotate-12 pointer-events-none select-none text-white">
        <h2 className="text-[8rem] sm:text-[10rem] md:text-[12rem] font-black leading-none">{watermarkNumber}</h2>
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 sm:gap-8 lg:gap-12">
        {/* Left Side: Info & Actions */}
        <div className="max-w-2xl flex-1 w-full min-w-0">
          {/* Badge */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4 sm:mb-5">
            {category && (
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-widest border"
                style={{
                  backgroundColor: 'rgba(var(--color-primary-rgb, 137, 153, 179), 0.12)',
                  borderColor: 'rgba(var(--color-primary-rgb, 137, 153, 179), 0.3)',
                  color: 'var(--color-primary, #8999b3)',
                }}
              >
                {category}
              </div>
            )}
            {featured && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-[10px] font-bold uppercase tracking-widest">
                <Sparkles size={11} /> Featured
              </div>
            )}
          </div>

          {/* Title */}
          <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 tracking-tight text-theme-base group-hover:text-theme-primary transition-colors">
            {title}
          </h3>

          {/* Description */}
          <p className="leading-relaxed mb-6 text-xs sm:text-sm md:text-base font-normal text-theme-muted">
            {description}
          </p>

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-6 sm:mb-8">
              {tags.map((tag, tagIndex) => (
                <span
                  key={tagIndex}
                  className="text-[11px] sm:text-xs px-2.5 sm:px-3 py-1 rounded-lg bg-theme-canvas text-theme-muted border border-theme font-mono flex items-center gap-1.5 hover:border-theme-primary hover:text-theme-primary transition-colors"
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: 'var(--color-primary, #8999b3)' }}
                  />
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {projectUrl && (
              <a
                href={projectUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 font-bold transition-all group/link text-xs sm:text-sm px-5 py-3 rounded-xl shadow-md text-white gradient-primary cursor-pointer hover:opacity-95"
              >
                <span>Live Preview & Demo</span>
                <ExternalLink
                  size={14}
                  className="group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform"
                />
              </a>
            )}

            {/* {repoLink && (
              <a
                href={repoLink}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-theme-canvas border border-theme hover:border-theme-primary text-theme-muted hover:text-theme-base transition-all text-xs sm:text-sm font-semibold cursor-pointer"
              >
                <Github size={15} />
                <span>Source Code</span>
              </a>
            )} */}
          </div>
        </div>

        {/* Right Side: Media Box */}
        <div
          className="w-full lg:w-80 xl:w-96 h-56 sm:h-64 lg:h-72 bg-theme-canvas border border-theme rounded-2xl flex items-center justify-center relative overflow-hidden group-hover:border-theme-primary transition-all shadow-2xl shrink-0"
        >
          <div
            className="absolute inset-0 rounded-full animate-pulse pointer-events-none"
            style={{
              background:
                'radial-gradient(circle at center, rgba(var(--color-primary-rgb, 137, 153, 179), 0.15) 0%, transparent 70%)',
            }}
          />

          {!imageError && imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              loading="lazy"
              className="w-full h-full object-cover object-top relative z-10 transition-transform duration-500 group-hover:scale-105"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-6 relative z-10 text-zinc-500">
              <Code2 size={32} className="text-theme-primary mb-2 opacity-70" />
              <span className="text-theme-primary font-mono text-[11px] uppercase tracking-widest mb-1">
                {category || 'Project'}
              </span>
              <span className="text-theme-base font-black text-sm sm:text-base tracking-wider uppercase">
                {title}
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default ProjectCard
