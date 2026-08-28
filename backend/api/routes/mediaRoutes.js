import express from 'express'
import { listMedia, getMediaFile } from '../controllers/mediaController.js'

const router = express.Router()

// Public — list all media (optional ?category= filter)
router.get('/', listMedia)

// Public — fetch a specific file by filename
router.get('/file/:filename', getMediaFile)

export default router
