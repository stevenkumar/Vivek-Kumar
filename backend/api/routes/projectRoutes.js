import express from 'express'
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  fetchPreviewImage,
} from '../controllers/projectController.js'
import { requireAdmin } from '../middleware/adminAuth.js'

const router = express.Router()

// Public — list projects
router.get('/', getProjects)

// Admin — CRUD
router.post('/admin/fetch-preview', requireAdmin, fetchPreviewImage)
router.post('/admin', requireAdmin, createProject)
router.put('/admin/:id', requireAdmin, updateProject)
router.delete('/admin/:id', requireAdmin, deleteProject)

export default router
