import express from 'express'
import {
  getSettings,
  adminLogin,
  changeAdminPassword,
  updateSettings,
  uploadResume,
  resumeUploadMiddleware,
} from '../controllers/settingsController.js'

const router = express.Router()

// Public settings route
router.get('/', getSettings)

// Admin authentication & management
router.post('/admin/login', adminLogin)
router.post('/admin/change-password', changeAdminPassword)
router.post('/admin/upload-resume', resumeUploadMiddleware, uploadResume)
router.put('/admin/settings', updateSettings)

export default router
