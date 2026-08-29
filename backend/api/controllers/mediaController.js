import { readJson } from '../store.js'

const PHOTOS_FILE = 'photos.json'

const getPhotosData = () => readJson(PHOTOS_FILE, [])

/**
 * GET /api/media — list media items (optional ?category= filter)
 */
export const listMedia = (req, res, next) => {
  try {
    const items = getPhotosData()
    const { category } = req.query

    if (category) {
      return res.json({
        success: true,
        data: items.filter((item) => item.category?.toLowerCase() === category.toLowerCase()),
      })
    }

    res.json({ success: true, data: items })
  } catch (error) {
    next(error)
  }
}

/**
 * GET /api/media/file/:filename — direct file getter (if needed)
 */
export const getMediaFile = (req, res, next) => {
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
