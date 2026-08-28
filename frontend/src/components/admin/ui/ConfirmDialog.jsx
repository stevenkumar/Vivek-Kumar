import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, Trash2, Loader2 } from 'lucide-react'

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Delete',
  loading = false,
  danger = true,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md bg-theme-card border border-theme rounded-[22px] p-6 sm:p-8 shadow-2xl z-10 text-theme-base"
          >
            <div className="flex items-center gap-3.5 mb-4">
              <div className={`p-3 rounded-2xl ${danger ? 'bg-red-950/60 text-red-400 border border-red-500/30' : 'bg-amber-950/60 text-amber-400 border border-amber-500/30'}`}>
                <AlertTriangle size={24} />
              </div>
              <div>
                <h4 className="text-lg font-bold">{title}</h4>
                <p className="text-xs text-theme-muted mt-0.5">Please confirm to proceed</p>
              </div>
            </div>

            <p className="text-sm text-theme-muted mb-6 leading-relaxed">{message}</p>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2.5 rounded-xl bg-theme-canvas border border-theme text-xs font-bold text-theme-muted hover:text-white transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={loading}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white transition shadow-lg cursor-pointer disabled:opacity-60 ${
                  danger ? 'bg-red-600 hover:bg-red-700 shadow-red-600/20' : 'gradient-primary'
                }`}
              >
                {loading ? <Loader2 size={14} className="animate-spin" /> : danger ? <Trash2 size={14} /> : null}
                <span>{loading ? 'Processing...' : confirmText}</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default ConfirmDialog
