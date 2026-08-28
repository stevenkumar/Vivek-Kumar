import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PHOTOS_DATA_PATH = path.join(__dirname, '..', 'data', 'photos.json')

const getPhotosData = () => {
  try {
    if (fs.existsSync(PHOTOS_DATA_PATH)) {
      const raw = fs.readFileSync(PHOTOS_DATA_PATH, 'utf-8')
      return JSON.parse(raw)
    }
  } catch (err) {
    console.error('Error reading photos.json:', err)
  }
  return []
}

/**
 * GET /api/media — list media items (optional ?category= filter)
 */
export const listMedia = async (req, res, next) => {
  try {
    let items = getPhotosData()
    const { category } = req.query

    if (category) {
      items = items.filter(
        (item) => item.category?.toLowerCase() === category.toLowerCase()
      )
    }

    res.json({ success: true, data: items })
  } catch (error) {
    next(error)
  }
}

/**
 * GET /api/media/file/:filename — direct file getter (if needed)
 */
export const getMediaFile = async (req, res, next) => {
  try {
    const items = getPhotosData()
    const found = items.find((i) => i.filename === req.params.filename)
    if (!found) {
      return res.status(404).json({ success: false, message: 'Media not found.' })
    }
    res.json({ success: true, data: found })
  } catch (error) {
    next(error)
  }
}
