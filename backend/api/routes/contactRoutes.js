import express from 'express'
import {
  sendContactMessage,
  getAdminMessages,
  toggleMessageRead,
  deleteAdminMessage,
} from '../controllers/contactController.js'

const router = express.Router()

// Public contact submission
router.post('/', sendContactMessage)

// Admin inbox endpoints
router.get('/admin/messages', getAdminMessages)
router.patch('/admin/messages/:id/read', toggleMessageRead)
router.delete('/admin/messages/:id', deleteAdminMessage)

export default router
