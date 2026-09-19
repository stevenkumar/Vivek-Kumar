import React from 'react'
import { X } from 'lucide-react'
import { motion } from 'framer-motion'
import { useSettings } from '../../context/SettingsContext'
import Button from './Button'
import Typography from './Typography'

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
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-4 right-4 h-8 w-8 text-theme-muted hover:text-white"
          aria-label="Close Profile Modal"
        >
          <X size={18} />
        </Button>
        <Typography variant="h3" className="text-2xl font-bold mb-6">Profile Details</Typography>
        <div className="space-y-4">
          <div className="flex flex-col items-center mb-6">
            <div className="w-24 h-24 bg-theme-canvas rounded-full mb-4 flex items-center justify-center border-2 border-dashed border-theme">
              <Typography variant="caption" className="text-sm lowercase tracking-normal">Profile Photo</Typography>
            </div>
            <Typography variant="body" className="font-bold text-lg text-theme-base">{profile?.name || 'Vivek Kumar'}</Typography>
            <Typography variant="caption" className="text-xs text-theme-primary lowercase tracking-normal">{profile?.role || 'Frontend Developer'}</Typography>
          </div>
          <Button
            variant="primary"
            size="md"
            onClick={onClose}
            className="w-full py-3"
          >
            Close
          </Button>
        </div>
      </motion.div>
    </div>
  )
}

export default ProfileModal
