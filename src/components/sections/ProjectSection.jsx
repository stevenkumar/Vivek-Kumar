import React, { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Layers } from 'lucide-react'
import ProjectCard from '../ui/ProjectCard'
import Button from '../ui/Button'
import Typography from '../ui/Typography'
import { projects } from '../../data/projects'

const ProjectSection = ({ onNavigateHome }) => {
  const [activeCategory, setActiveCategory] = useState('All')

  const categories = useMemo(() => {
    const set = new Set(['All'])
    projects.forEach((p) => {
      if (p.category) set.add(p.category)
    })
    return Array.from(set)
  }, [])

  const filteredProjects = useMemo(() => {
    if (activeCategory === 'All') return projects
    return projects.filter((p) => p.category?.toLowerCase() === activeCategory.toLowerCase())
  }, [activeCategory])

  return (
    <section className="py-28 bg-theme-canvas px-4 min-h-screen text-theme-base overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          {onNavigateHome && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onNavigateHome}
              className="inline-flex items-center gap-2 text-theme-muted hover:text-theme-base transition-colors group cursor-pointer w-fit h-auto px-0 py-0"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1.5 transition-transform" />
              <span className="font-semibold text-sm">Back to Home</span>
            </Button>
          )}

          <div className="flex items-center gap-2 text-xs font-mono text-theme-muted">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span>{filteredProjects.length} Projects Available</span>
          </div>
        </div>

        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Typography
            variant="caption"
            className="text-theme-primary text-xs sm:text-sm font-bold tracking-widest uppercase mb-3 block"
          >
            — Selected Works —
          </Typography>

          <Typography
            variant="h1"
            className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight mb-4 gradient-primary-text"
          >
            Featured Projects
          </Typography>

          <Typography variant="lead" className="text-theme-muted text-base sm:text-lg leading-relaxed">
            Explore a curated selection of full-stack web applications, interactive dashboards, and design systems built with modern web technologies.
          </Typography>
        </div>

        {/* Category Filter Tabs */}
        {categories.length > 1 && (
          <div className="flex justify-center mb-12">
            <div className="inline-flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-2xl bg-theme-card border border-theme backdrop-blur-md">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`relative px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer bg-transparent border-0 ${
                    activeCategory === cat ? 'text-white' : 'text-theme-muted hover:text-theme-base hover:bg-theme-canvas/50'
                  }`}
                >
                  {activeCategory === cat && (
                    <motion.div
                      layoutId="activeProjectTab"
                      className="absolute inset-0 rounded-xl gradient-primary shadow-md"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{cat}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Projects List */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-24 bg-theme-card rounded-[22px] border border-theme p-8">
            <Layers size={48} className="mx-auto text-zinc-600 mb-4" />
            <Typography variant="h3" className="text-xl font-bold mb-2">No projects found in this category</Typography>
            <Typography variant="body" className="text-sm mb-6">Try switching to a different category filter.</Typography>
            <Button
              variant="primary"
              size="md"
              onClick={() => setActiveCategory('All')}
              className="px-6 py-2.5 text-sm font-bold"
            >
              View All Projects
            </Button>
          </div>
        ) : (
          <motion.div layout className="flex flex-col gap-8 md:gap-10">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, index) => (
                <ProjectCard key={project.id || index} project={project} index={index} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  )
}

export default ProjectSection