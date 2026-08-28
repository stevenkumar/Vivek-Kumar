import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

export const AdminModal = ({ isOpen, onClose, title, subtitle, icon: Icon, children, maxWidth = 'max-w-2xl' }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className={`relative w-full ${maxWidth} max-h-[90vh] flex flex-col bg-theme-card border border-theme rounded-[22px] shadow-2xl overflow-hidden z-10`}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-theme bg-theme-canvas/40">
              <div className="flex items-center gap-3">
                {Icon && (
                  <div className="p-2 bg-theme-canvas rounded-xl border border-theme text-theme-primary">
                    <Icon size={18} />
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-bold text-theme-base">{title}</h3>
                  {subtitle && <p className="text-xs text-theme-muted">{subtitle}</p>}
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-theme-muted hover:text-white rounded-xl hover:bg-theme-canvas transition cursor-pointer"
                title="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default AdminModal
