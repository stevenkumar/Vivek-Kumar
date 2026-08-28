import express from 'express'
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  fetchPreviewImage,
} from '../controllers/projectController.js'

const router = express.Router()

// Public
router.get('/', getProjects)

// Admin
router.post('/admin/fetch-preview', fetchPreviewImage)
router.post('/admin', createProject)
router.put('/admin/:id', updateProject)
router.delete('/admin/:id', deleteProject)

export default router
