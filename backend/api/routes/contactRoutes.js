import express from 'express'
import {
  sendContactMessage,
  getAdminMessages,
  toggleMessageRead,
  deleteAdminMessage,
} from '../controllers/contactController.js'
import { requireAdmin } from '../middleware/adminAuth.js'

const router = express.Router()

// Public contact submission
router.post('/', sendContactMessage)

// Admin inbox endpoints
router.get('/admin/messages', requireAdmin, getAdminMessages)
router.patch('/admin/messages/:id/read', requireAdmin, toggleMessageRead)
router.delete('/admin/messages/:id', requireAdmin, deleteAdminMessage)

export default router
