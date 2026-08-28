import React from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import { useSettings } from '../../context/SettingsContext'

const ProfileModal = ({ isOpen, onClose }) => {
  const { profile } = useSettings()
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-theme-card border border-theme rounded-[22px] p-8 w-full max-w-md relative shadow-2xl text-theme-base"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-theme-muted hover:text-white transition cursor-pointer">
          <XMarkIcon className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold mb-6 text-theme-base">Profile Details</h2>
        <div className="space-y-4">
          <div className="flex flex-col items-center mb-6">
            <div className="w-24 h-24 bg-theme-canvas rounded-full mb-4 flex items-center justify-center border-2 border-dashed border-theme">
              <span className="text-sm text-theme-muted">Profile Photo</span>
            </div>
            <p className="font-bold text-lg text-theme-base">{profile?.name || 'Vivek Kumar'}</p>
            <p className="text-xs text-theme-primary font-mono">{profile?.role || 'Frontend Developer'}</p>
          </div>
          <button onClick={onClose} className="w-full gradient-primary text-white font-bold py-3 rounded-xl transition cursor-pointer shadow-md">
            Close
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default ProfileModal
