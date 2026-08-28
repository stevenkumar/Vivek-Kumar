import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, X, RefreshCw, Layers } from 'lucide-react'

const skeletonItems = Array.from({ length: 6 })

const PhotosSection = () => {
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [lightbox, setLightbox] = useState(null)

  const fetchPhotos = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/media?category=photo')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setPhotos(data.data || [])
    } catch {
      setError('Unable to load photos.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPhotos()
  }, [])

  return (
    <section id="photos" className="py-28 bg-theme-canvas text-theme-base min-h-screen px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex items-center gap-4 mb-12">
          <div className="p-3 bg-theme-card rounded-2xl border border-theme text-theme-primary">
            <Camera size={28} />
          </div>
          <div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-theme-base">Photography Gallery</h2>
            <p className="text-theme-muted text-sm mt-1">A glimpse into visual perspectives and moments captured behind the lens.</p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-8 rounded-2xl border border-red-500/50 bg-red-950/40 p-5 text-red-200 flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={fetchPhotos}
              className="flex items-center gap-2 text-xs bg-red-800/60 hover:bg-red-700 px-3 py-1.5 rounded-lg transition cursor-pointer"
            >
              <RefreshCw size={14} /> Retry
            </button>
          </div>
        )}

        {/* Grid / Skeletons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {loading ? (
            skeletonItems.map((_, i) => (
              <div key={i} className="aspect-square rounded-3xl bg-theme-card border border-theme animate-pulse" />
            ))
          ) : photos.length === 0 ? (
            <div className="col-span-3 text-center py-20 text-theme-muted bg-theme-card rounded-3xl border border-theme">
              <Layers size={36} className="mx-auto mb-3 opacity-40" />
              <p>No photos available at the moment.</p>
            </div>
          ) : (
            photos.map((photo, i) => (
              <motion.div
                key={photo.id || i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                onClick={() => setLightbox(i)}
                className="relative group aspect-square overflow-hidden rounded-3xl border border-theme bg-theme-card cursor-pointer shadow-xl"
              >
                <img
                  src={photo.url}
                  alt={photo.title || 'Photograph'}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end">
                  <h3 className="text-white font-bold text-lg">{photo.title}</h3>
                  {photo.description && <p className="text-zinc-300 text-xs mt-1">{photo.description}</p>}
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Lightbox Modal */}
        <AnimatePresence>
          {lightbox !== null && photos[lightbox] && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLightbox(null)}
              className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
            >
              <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
                <img
                  src={photos[lightbox].url}
                  alt={photos[lightbox].title || 'Photo'}
                  className="w-full max-h-[80vh] object-contain rounded-2xl border border-white/10"
                />
                <p className="text-center text-zinc-300 mt-4 text-sm font-medium">
                  {photos[lightbox].title}
                  <span className="text-zinc-500 ml-2 font-mono">({lightbox + 1}/{photos.length})</span>
                </p>
                <button
                  onClick={() => setLightbox(null)}
                  className="absolute -top-4 -right-4 bg-zinc-800 hover:bg-red-600 text-white transition-colors rounded-full p-2.5 shadow-xl cursor-pointer border border-white/10"
                >
                  <X size={18} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

export default PhotosSection
