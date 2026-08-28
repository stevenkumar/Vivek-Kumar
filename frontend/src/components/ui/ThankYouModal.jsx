import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'

const backdropVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } }
const modalVariants = { hidden: { opacity: 0, y: 40, scale: 0.95 }, visible: { opacity: 1, y: 0, scale: 1 } }

const ThankYouModal = ({ isOpen, onClose, message }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-md rounded-[22px] bg-theme-card p-8 shadow-2xl border border-theme text-theme-base"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 text-emerald-400 mb-4">
              <CheckCircle2 size={28} />
              <h3 className="text-2xl font-bold">Thanks for reaching out!</h3>
            </div>
            <p className="text-theme-muted mb-6 text-sm leading-relaxed">{message}</p>
            <button
              onClick={onClose}
              className="w-full rounded-xl gradient-primary px-5 py-3 text-sm font-bold text-white transition hover:opacity-90 shadow-md cursor-pointer"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ThankYouModal
