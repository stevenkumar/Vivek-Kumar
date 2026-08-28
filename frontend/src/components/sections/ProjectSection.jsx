import React, { useEffect, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Layers, RefreshCw } from 'lucide-react'
import ProjectCard from '../ui/ProjectCard'
import { projects as fallbackProjects } from '../../data/projects'

const skeletonCards = Array.from({ length: 3 })

const ProjectSection = ({ onNavigateHome }) => {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  const fetchProjects = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/projects')
      if (!response.ok) {
        throw new Error(`Failed to load projects (HTTP ${response.status})`)
      }
      const data = await response.json()
      const projectList = Array.isArray(data.data) && data.data.length > 0 ? data.data : fallbackProjects
      setProjects(projectList)
    } catch (err) {
      console.warn('Backend fetch failed, using fallback projects data:', err.message)
      setProjects(fallbackProjects)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const categories = useMemo(() => {
    const set = new Set(['All'])
    projects.forEach((p) => {
      if (p.category) set.add(p.category)
    })
    return Array.from(set)
  }, [projects])

  const filteredProjects = useMemo(() => {
    if (activeCategory === 'All') return projects
    return projects.filter((p) => p.category?.toLowerCase() === activeCategory.toLowerCase())
  }, [projects, activeCategory])

  return (
    <section className="py-28 bg-theme-canvas px-4 min-h-screen text-theme-base overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          {onNavigateHome && (
            <motion.button
              onClick={onNavigateHome}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 text-theme-muted hover:text-theme-base transition-colors group cursor-pointer w-fit"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1.5 transition-transform" />
              <span className="font-semibold text-sm">Back to Home</span>
            </motion.button>
          )}

          <div className="flex items-center gap-2 text-xs font-mono text-theme-muted">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span>{filteredProjects.length} Projects Available</span>
          </div>
        </div>

        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-theme-primary text-xs sm:text-sm font-bold tracking-widest uppercase mb-3 font-mono"
          >
            — Selected Works —
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight mb-4 gradient-primary-text"
          >
            Featured Projects
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-theme-muted text-base sm:text-lg leading-relaxed"
          >
            Explore a curated selection of full-stack web applications, interactive dashboards, and design systems built with modern web technologies.
          </motion.p>
        </div>

        {/* Category Filter Tabs */}
        {categories.length > 1 && (
          <div className="flex justify-center mb-12">
            <div className="inline-flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-2xl bg-theme-card border border-theme backdrop-blur-md">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`relative px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
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

        {/* Error Alert */}
        {error && (
          <div className="mb-8 rounded-2xl border border-red-500/50 bg-red-950/40 p-5 text-red-200 flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={fetchProjects}
              className="flex items-center gap-2 text-xs bg-red-800/60 hover:bg-red-700 px-3 py-1.5 rounded-lg transition cursor-pointer"
            >
              <RefreshCw size={14} /> Retry
            </button>
          </div>
        )}

        {/* Projects List */}
        {loading ? (
          <div className="flex flex-col gap-8 md:gap-10">
            {skeletonCards.map((_, index) => (
              <div
                key={index}
                className="bg-theme-card rounded-[22px] p-8 md:p-12 border border-theme flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 animate-pulse"
              >
                <div className="max-w-2xl flex-1 w-full space-y-4">
                  <div className="h-6 w-28 bg-theme-canvas rounded-full" />
                  <div className="h-9 w-3/4 bg-theme-canvas rounded-xl" />
                  <div className="h-4 w-full bg-theme-canvas/80 rounded" />
                  <div className="h-4 w-5/6 bg-theme-canvas/80 rounded" />
                  <div className="flex gap-2 pt-2">
                    <div className="h-7 w-20 bg-theme-canvas rounded-lg" />
                    <div className="h-7 w-24 bg-theme-canvas rounded-lg" />
                    <div className="h-7 w-20 bg-theme-canvas rounded-lg" />
                  </div>
                  <div className="h-10 w-40 bg-theme-canvas rounded-xl pt-2" />
                </div>
                <div className="w-full lg:w-80 xl:w-96 h-64 sm:h-72 bg-theme-canvas/60 border border-theme rounded-2xl shrink-0" />
              </div>
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-24 bg-theme-card rounded-[22px] border border-theme p-8">
            <Layers size={48} className="mx-auto text-zinc-600 mb-4" />
            <h3 className="text-xl font-bold text-theme-base mb-2">No projects found in this category</h3>
            <p className="text-theme-muted text-sm mb-6">Try switching to a different category filter.</p>
            <button
              onClick={() => setActiveCategory('All')}
              className="gradient-primary text-white text-sm font-bold px-6 py-2.5 rounded-xl transition cursor-pointer shadow-md"
            >
              View All Projects
            </button>
          </div>
        ) : (
          <motion.div layout className="flex flex-col gap-8 md:gap-10">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, index) => (
                <ProjectCard key={project._id || project.id || index} project={project} index={index} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  )
}

export default ProjectSection
