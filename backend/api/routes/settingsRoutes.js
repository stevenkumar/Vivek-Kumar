import express from 'express'
import {
  getSettings,
  adminLogin,
  changeAdminPassword,
  updateSettings,
  uploadResume,
  resumeUploadMiddleware,
} from '../controllers/settingsController.js'
import { requireAdmin } from '../middleware/adminAuth.js'

const router = express.Router()

// Public settings route
router.get('/', getSettings)

// Admin authentication & management
router.post('/admin/login', adminLogin)
router.post('/admin/change-password', requireAdmin, changeAdminPassword)
router.post('/admin/upload-resume', requireAdmin, resumeUploadMiddleware, uploadResume)
router.put('/admin/settings', requireAdmin, updateSettings)

export default router
